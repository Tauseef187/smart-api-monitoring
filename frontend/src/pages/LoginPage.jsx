import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const [values, setValues] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const nextErrors = {};
    if (!values.email) nextErrors.email = "Email is required";
    if (!values.password) nextErrors.password = "Password is required";
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setLoading(true);
      await login({ email: values.email, password: values.password });
      navigate(location.state?.from?.pathname || "/app/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <form onSubmit={handleSubmit} className="glass-panel w-full max-w-md p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Welcome back</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">Sign in to your command center</h1>
        <div className="mt-8 space-y-5">
          <Input label="Email" type="email" value={values.email} error={errors.email} onChange={(event) => setValues({ ...values, email: event.target.value })} />
          <Input label="Password" type="password" value={values.password} error={errors.password} onChange={(event) => setValues({ ...values, password: event.target.value })} />
          <div className="flex items-center justify-between text-sm text-slate-400">
            <label className="flex items-center gap-2"><input type="checkbox" checked={values.remember} onChange={(event) => setValues({ ...values, remember: event.target.checked })} />Remember me</label>
            <button type="button" className="text-blue-300">Forgot Password</button>
          </div>
        </div>
        <Button type="submit" className="mt-8 w-full" loading={loading}>Login</Button>
        <p className="mt-6 text-center text-sm text-slate-400">New here? <Link to="/register" className="text-blue-300">Create an account</Link></p>
      </form>
    </div>
  );
}

export default LoginPage;

