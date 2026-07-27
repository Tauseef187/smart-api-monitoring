import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const nextErrors = {};
    if (!values.name) nextErrors.name = "Name is required";
    if (!values.email) nextErrors.email = "Email is required";
    if (values.password.length < 6) nextErrors.password = "Use at least 6 characters";
    if (values.password !== values.confirmPassword) nextErrors.confirmPassword = "Passwords do not match";
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setLoading(true);
      await register({ name: values.name, email: values.email, password: values.password });
      navigate("/app/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <form onSubmit={handleSubmit} className="glass-panel w-full max-w-lg p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Create account</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Launch your monitoring workspace</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Input label="Name" value={values.name} error={errors.name} onChange={(event) => setValues({ ...values, name: event.target.value })} />
          <Input label="Email" type="email" value={values.email} error={errors.email} onChange={(event) => setValues({ ...values, email: event.target.value })} />
          <Input label="Password" type="password" value={values.password} error={errors.password} onChange={(event) => setValues({ ...values, password: event.target.value })} />
          <Input label="Confirm Password" type="password" value={values.confirmPassword} error={errors.confirmPassword} onChange={(event) => setValues({ ...values, confirmPassword: event.target.value })} />
        </div>
        <Button type="submit" className="mt-8 w-full" loading={loading}>Create Account</Button>
        <p className="mt-6 text-center text-sm text-slate-400">Already have an account? <Link to="/login" className="text-blue-300">Login</Link></p>
      </form>
    </div>
  );
}

export default RegisterPage;

