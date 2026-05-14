import { Log } from './logging_middleware/logger';

function MyComponent() {
  const handleClick = () => {
    Log("frontend", "info", "component", "User clicked submit button");
  };
}