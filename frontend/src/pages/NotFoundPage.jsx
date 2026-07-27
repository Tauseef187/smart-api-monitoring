import { Link } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";

function NotFoundPage() {
  return <div className="flex min-h-screen items-center justify-center px-4"><EmptyState title="404" description="The page you requested drifted outside the monitoring perimeter." action={<Link to="/"><Button>Return Home</Button></Link>} /></div>;
}

export default NotFoundPage;

