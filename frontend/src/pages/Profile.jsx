import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import toast, { Toaster } from "react-hot-toast";
import "./Dashboard.css";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(
    "path/to/profile-pic.jpg"
  );
  const [addresses, setAddresses] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    phoneNumber: "",
    state: "",
    city: "",
    country: "",
    street: "",
    postalCode: "",
    houseNumber: "",
  });
  const [showAddressesModal, setShowAddressesModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const { email: userEmail, profilePicture: userProfilePicture } =
        currentUser;
      setEmail(userEmail);
      setProfilePicture(userProfilePicture);
      setUsername(userEmail.substring(0, userEmail.indexOf("@")));
      fetchAddresses();
    }
  }, [currentUser]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/address");
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      } else {
        toast.error("Failed to fetch addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return toast.error("Please fill all fields");
    }
    if (newPassword !== confirmNewPassword) {
      return toast.error("New password and confirm password do not match");
    }
    try {
      const verifyResponse = await fetch("/api/user/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword }),
      });
      if (!verifyResponse.ok) {
        return toast.error("Incorrect current password");
      }

      const updateResponse = await fetch("/api/user/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (updateResponse.ok) {
        setNewPassword("");
        setConfirmNewPassword("");
        setCurrentPassword("");
        setShowChangePasswordModal(false);
        toast.success("Password updated successfully");
      } else {
        toast.error("Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Error updating password");
    }
  };

  const handleOpenAddAddressModal = () => {
    setShowAddAddressModal(true);
  };

  const handleCloseAddAddressModal = () => {
    setShowAddAddressModal(false);
  };

  const handleNewAddressFormChange = (e) => {
    setAddressFormData({
      ...addressFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/address/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressFormData),
      });
      if (response.ok) {
        setAddressFormData({
          phoneNumber: "",
          state: "",
          city: "",
          country: "",
          street: "",
          postalCode: "",
          houseNumber: "",
        });
        setShowAddAddressModal(false);
        fetchAddresses();
      } else {
        console.error("Failed to create address");
      }
    } catch (error) {
      console.error("Error creating address:", error);
    }
  };

  const handleShowAddresses = () => {
    setShowAddressesModal(true);
  };

  const handleCloseAddressesModal = () => {
    setShowAddressesModal(false);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await fetch(`/api/address/${addressId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAddresses(addresses.filter((address) => address._id !== addressId));
        console.log("Address deleted successfully");
      } else {
        console.error("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Toaster position="center" />
      <div className="user-info">
        <img src={profilePicture} alt="Profile" className="profile-picture" />
        <h2>Welcome, {username}!</h2>
        <p>Email: {email}</p>
        <div>
          <Button
            color="primary"
            onClick={() => setShowChangePasswordModal(true)}
          >
            Change Password
          </Button>
          {showChangePasswordModal && (
            <Modal
              isOpen={showChangePasswordModal}
              toggle={() => setShowChangePasswordModal(false)}
              className="custom-modal"
            >
              <ModalHeader toggle={() => setShowChangePasswordModal(false)}>
                Change Password
              </ModalHeader>
              <ModalBody>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                  className="form-input"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="form-input"
                />
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="form-input"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={handlePasswordChange}>
                  Change Password
                </Button>
                <Button
                  color="secondary"
                  onClick={() => setShowChangePasswordModal(false)}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          )}
        </div>
      </div>
      <div className="addresses">
        <h3>Addresses</h3>
        <Button
          color="primary"
          onClick={handleShowAddresses}
          style={{ marginRight: "10px" }}
        >
          Show Addresses
        </Button>
        <Modal
          isOpen={showAddressesModal}
          toggle={handleCloseAddressesModal}
          className="custom-modal"
        >
          <ModalHeader toggle={handleCloseAddressesModal}>
            Addresses
          </ModalHeader>
          <ModalBody>
            <ul>
              {addresses.map((address) => (
                <li key={address._id}>
                  {address.houseNumber}, {address.street}, {address.city},{" "}
                  {address.state}, {address.country}, {address.postalCode}
                  <Button
                    color="danger"
                    onClick={() => handleDeleteAddress(address._id)}
                    className="delete-btn"
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={handleCloseAddressesModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        <Button color="primary" onClick={handleOpenAddAddressModal}>
          Add Address
        </Button>
        <Modal
          isOpen={showAddAddressModal}
          toggle={handleCloseAddAddressModal}
          className="custom-modal"
        >
          <ModalHeader toggle={handleCloseAddAddressModal}>
            Add Address
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleNewAddressSubmit}>
              <input
                type="text"
                name="phoneNumber"
                value={addressFormData.phoneNumber}
                onChange={handleNewAddressFormChange}
                placeholder="Phone Number"
                className="form-input"
              />
              <input
                type="text"
                name="state"
                value={addressFormData.state}
                onChange={handleNewAddressFormChange}
                placeholder="State"
                className="form-input"
              />
              <input
                type="text"
                name="city"
                value={addressFormData.city}
                onChange={handleNewAddressFormChange}
                placeholder="City"
                className="form-input"
              />
              <input
                type="text"
                name="country"
                value={addressFormData.country}
                onChange={handleNewAddressFormChange}
                placeholder="Country"
                className="form-input"
              />
              <input
                type="text"
                name="street"
                value={addressFormData.street}
                onChange={handleNewAddressFormChange}
                placeholder="Street"
                className="form-input"
              />
              <input
                type="text"
                name="postalCode"
                value={addressFormData.postalCode}
                onChange={handleNewAddressFormChange}
                placeholder="Postal Code"
                className="form-input"
              />
              <input
                type="text"
                name="houseNumber"
                value={addressFormData.houseNumber}
                onChange={handleNewAddressFormChange}
                placeholder="House Number"
                className="form-input"
              />
              <Button type="submit" className="submit-btn">
                Submit
              </Button>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}
