const FormAlert = ({ error, success }) => {
  if (!error && !success) {
    return null;
  }

  return (
    <div
      className={`alert ${error ? "alert-danger" : "alert-success"} mb-20`}
      role="alert"
    >
      {error || success}
    </div>
  );
};

export default FormAlert;
