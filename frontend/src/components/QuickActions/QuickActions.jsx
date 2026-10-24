import { useNavigate } from "react-router-dom";
function QuickActions() {
  const navigate = useNavigate();
  return (
    <section>
      {" "}
      <h2>Quick actions</h2>{" "}
      <button type="button" onClick={() => navigate("/products")}>
        {" "}
        Manage products{" "}
      </button>{" "}
      <button type="button" onClick={() => navigate("/sales")}>
        {" "}
        Record sale{" "}
      </button>{" "}
      <button type="button" onClick={() => navigate("/inventory")}>
        {" "}
        Adjust inventory{" "}
      </button>{" "}
      <button type="button" onClick={() => navigate("/reports")}>
        {" "}
        View reports{" "}
      </button>{" "}
    </section>
  );
}
export default QuickActions;
