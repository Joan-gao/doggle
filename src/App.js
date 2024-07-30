import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import Billing from "./pages/Billing";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import CalendarBill from "./pages/CalendarBill.js";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import ChatBot from "./pages/ChatBot.js";
import Dashboard from "./pages/Dashboard.js";
function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/sign-up" exact component={SignUp} />
        <Route path="/sign-in" exact component={SignIn} />
        <Main>
          <Route exact path="/" component={Home} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/tables" component={Tables} />
          <Route exact path="/billing" component={Billing} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/chatbot" component={ChatBot} />
          <Route exact path="/calendarbill" component={CalendarBill} />
          {/* <Redirect from="*" to="/dashboard" /> */}
        </Main>
      </Switch>
    </div>
  );
}

export default App;
