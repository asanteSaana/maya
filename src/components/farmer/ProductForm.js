import Link from "next/link";
import { useState } from "react";
import FormAlert from "../FormAlert";

const emptyRow = () => ({ size: "", price: "", stock: "" });

const toForm = (product) => {
  if (!product) {
    return {
      name: "",
      description: "",
      image: "",
      category: "",
      color: "",
      catalogue: [emptyRow()],
    };
  }

  return {
    name: product.title || "",
    description: product.description || "",
    image: product.image || "",
    category: (Array.isArray(product.categories)
      ? product.categories
      : [product.categories]
    )
      .filter(Boolean)
      .join(", "),
    color: product.color || "",
    catalogue: product.catalogue.length
      ? product.catalogue.map((entry) => ({
          size: entry.size || "",
          price: String(entry.price ?? ""),
          stock: String(entry.stock ?? ""),
        }))
      : [emptyRow()],
  };
};

/**
 * Create/edit form for a farmer's listing. `mode` matters because the backend's
 * update endpoint accepts only description and catalogue — the other fields are
 * fixed once a product exists.
 */
const ProductForm = ({ product, mode = "create", onSubmit, submitLabel }) => {
  const [form, setForm] = useState(() => toForm(product));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = mode === "edit";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleRowChange = (index, field, value) => {
    setForm((current) => ({
      ...current,
      catalogue: current.catalogue.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      ),
    }));
  };

  const addRow = () =>
    setForm((current) => ({
      ...current,
      catalogue: [...current.catalogue, emptyRow()],
    }));

  const removeRow = (index) =>
    setForm((current) => ({
      ...current,
      catalogue:
        current.catalogue.length === 1
          ? current.catalogue
          : current.catalogue.filter((_, rowIndex) => rowIndex !== index),
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const catalogue = form.catalogue
      .filter((row) => row.price !== "")
      .map((row) => ({
        size: row.size.trim(),
        price: Number(row.price),
        stock: Number(row.stock || 0),
      }));

    if (!catalogue.length) {
      setError("Add at least one size with a price.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit(
        isEdit
          ? { desc: form.description, catalogue }
          : {
              name: form.name.trim(),
              description: form.description.trim(),
              image: form.image.trim(),
              category: form.category
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean),
              color: form.color.trim(),
              catalogue,
            }
      );
    } catch (requestError) {
      setError(requestError.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-form wow fadeInUp delay-0-2s">
      <FormAlert error={error} />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="e.g. Organic Tomatoes"
            value={form.name}
            onChange={handleChange}
            disabled={isEdit}
            required={!isEdit}
          />
          {isEdit && (
            <small>The name cannot be changed after a listing is created.</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows={4}
            placeholder="How it was grown, when it was harvested…"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="image">Image URL</label>
              <input
                type="url"
                id="image"
                name="image"
                className="form-control"
                placeholder="https://…"
                value={form.image}
                onChange={handleChange}
                disabled={isEdit}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="color">Colour</label>
              <input
                type="text"
                id="color"
                name="color"
                className="form-control"
                placeholder="e.g. Green"
                value={form.color}
                onChange={handleChange}
                disabled={isEdit}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Categories</label>
          <input
            type="text"
            id="category"
            name="category"
            className="form-control"
            placeholder="Comma separated, e.g. Vegetables, Organic"
            value={form.category}
            onChange={handleChange}
            disabled={isEdit}
          />
        </div>

        <h6 className="pt-15">Sizes &amp; pricing</h6>
        {form.catalogue.map((row, index) => (
          // Rows have no stable id before they are saved, so the index is the
          // only available key here.
          // eslint-disable-next-line react/no-array-index-key
          <div className="row align-items-end" key={index}>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor={`size-${index}`}>Size</label>
                <input
                  type="text"
                  id={`size-${index}`}
                  className="form-control"
                  placeholder="e.g. 1kg"
                  value={row.size}
                  onChange={(event) =>
                    handleRowChange(index, "size", event.target.value)
                  }
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor={`price-${index}`}>Price</label>
                <input
                  type="number"
                  id={`price-${index}`}
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={row.price}
                  onChange={(event) =>
                    handleRowChange(index, "price", event.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor={`stock-${index}`}>Stock</label>
                <input
                  type="number"
                  id={`stock-${index}`}
                  className="form-control"
                  min="0"
                  value={row.stock}
                  onChange={(event) =>
                    handleRowChange(index, "stock", event.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <button
                  type="button"
                  className="btn-destructive w-100"
                  onClick={() => removeRow(index)}
                  disabled={form.catalogue.length === 1}
                  aria-label={`Remove size ${index + 1}`}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn-quiet mb-25"
          onClick={addRow}
        >
          Add another size
        </button>

        <div className="form-group mb-0">
          <button
            type="submit"
            className="theme-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : submitLabel}
            <i className="fas fa-angle-double-right" />
          </button>
          <Link href="/farmer/products">
            <a className="theme-btn style-two ml-10">Cancel</a>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
