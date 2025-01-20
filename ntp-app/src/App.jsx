import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <>
      <div style={{ marginTop: "10px" }}>
        <Button>Primary Button</Button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Button variant="secondary">Secondary Button</Button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Button variant="destructive">Destructive Button</Button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Button variant="outline">Outline Button</Button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Button variant="ghost">Ghost Button</Button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Button variant="link">Link Button</Button>
      </div>
    </>
  );
}

export default App;
