import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AddBurger from "./pages/AddBurger";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import PageNotFound from "./components/PageNotFound";
import Profile from "./pages/Profile";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailed from "./components/PaymentFailed";
import PaymentCancel from "./components/PaymentCancel";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/payment/success/:transactionId"
            element={<PaymentSuccess />}
          />
          <Route
            path="/payment/failure/:transactionId"
            element={<PaymentFailed />}
          />
          <Route
            path="/payment/cancel/:transactionId"
            element={<PaymentCancel />}
          />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/add-burger" element={<AddBurger />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
