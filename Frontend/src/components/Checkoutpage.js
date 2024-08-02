import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "./navbar";
import { useCart } from "./CartContext";
import axios from "axios";
import Select from "react-select";
import Notification from "./Notification";

const USA_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "Atlantis",
  "Pacifica",
  "Cascadia",
  "Jefferson",
  "New Caledonia",
  "Aurelia",
  "Midgard",
  "Elysium",
  "Asgard",
  "Valhalla",
  "Nova Terra",
  "Zion",
  "Arcadia",
  "Erewhon",
  "Narnia",
  "Gondwana",
  "Elbonia",
  "Freedonia",
  "Wakanda",
  "Genovia",
  "Panem",
  "Sylvania",
  "Ruritania",
  "Latveria",
  "Qumar",
  "Agrabah",
  "Eldorado",
  "Brigadoon",
  "Gilead",
  "Narnia",
  "Avalon",
  "Hogsmeade",
  "King's Landing",
  "Westeros",
  "Pandora",
  "Shangri-La",
  "Mordor",
  "Oz",
  "Lilliput",
  "Brobdingnag",
  "Laputa",
  "Blefuscu",
  "Aztlan",
  "Hyperborea",
  "Valinor",
  "Terra Nova",
  "Naboo",
  "Krypton",
  "Gallifrey",
  "Arrakis",
];

const Checkout = () => {
  const { user, cartItems, calculateTotalPrice } = useCart();
  const [skipShippingAddress, setSkipShippingAddress] = useState(false);
  const totalPrice = calculateTotalPrice();
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState(null);
  const [fields, setFields] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    country: "United States",
    state: "",
    city: "",
    address1: "",
    address2: "",
    pincode: "",
    phone: user.phone,
  });
  const [newFields, setNewFields] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    country: "United States",
    state: "",
    city: "",
    address1: "",
    address2: "",
    pincode: "",
    phone: user.phone,
  });

  const stateOptions = USA_STATES.map((state) => ({
    value: state,
    label: state,
  }));

  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (selectedOption) => {
    setFields({ ...fields, state: selectedOption ? selectedOption.value : "" });
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setNewFields({ ...newFields, [name]: value });
  };


  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedOption(checked ? value : "same"); // Update the selected option
  
    if (value === "same" && checked) {
      // Set shipping address to match billing address if "same" is selected
      if (selectedBillingAddress) {
        setSelectedShippingAddress(selectedBillingAddress);
      }
    } else if (value === "new" && checked) {
      // Handle new address input if "new" is selected
      setSelectedShippingAddress(null);
    }
  };
  
  const handleContinue = (e) => {
    e.preventDefault();

    if (step === 2 && skipShippingAddress) {
      if (validateBillingAddress()) {
        setStep(step + 2);
      }
    } else {
      if (step === 2) {
        if (validateBillingAddress()) {
          if (selectedShippingAddress) {
            setStep(step + 2);
          } else {
            setStep(step + 1);
          }
        }
      } else if (step === 3) {
        if (!selectedOption) {
          setErrorMessage("Please select an address option.");
          return;
        }

        if (selectedOption === "new" && !validateShippingAddress()) {
          return;
        } else if (selectedOption !== "new" && selectedOption !== "same") {
          return;
        }
        setErrorMessage("");
        setStep(step + 1);
      } else if (step === 4) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step === 4 && skipShippingAddress) {
      setStep(2);
    } else {
      setStep(step - 1);
    }
  };

  const validateBillingAddress = () => {
    const PINCODE_PATTERN = /^[0-9]{5}$/;

    return (
      fields.country.trim() !== "" &&
      fields.state.trim() !== "" &&
      fields.city.trim() !== "" &&
      fields.address1.trim() !== "" &&
      fields.pincode.trim() !== "" &&
      PINCODE_PATTERN.test(fields.pincode.trim())
    );
  };
  const validateShippingAddress = () => {
    const PINCODE_PATTERN = /^[0-9]{5}$/;
    if (selectedOption === "new") {
      if (
        !newFields.country ||
        !newFields.state ||
        !newFields.city ||
        !newFields.address1 ||
        // !newFields.address2 ||
        !PINCODE_PATTERN.test(newFields.pincode.trim())
      ) {
        return false;
      }
    }

    return true;
  };

  const handleSkipShippingChange = (e) => {
    setSkipShippingAddress(e.target.checked);
  };

  
  const createPayment = async () => {
    setDisabled(true);
    try {
        let shippingAddressData = {};
        let billingAddressData = {};

        // Case 1: Both selectedBillingAddress and selectedShippingAddress are present
        if (selectedBillingAddress && selectedShippingAddress) {
            console.log("Skipping Axios POST requests for shipping and billing addresses");
            setDisabled(false);
        } else if (selectedBillingAddress && !selectedShippingAddress) {
            // Case 2: Only selectedBillingAddress is present and a new billing address is selected
            if (selectedOption === "new") {
                shippingAddressData = newFields;
            } else {
                shippingAddressData = fields;
            }
            // Post shipping address
            const token = sessionStorage.getItem("user-token");
            await axios.post(
                `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveShippingAddress`,
                {
                    shippingAddress: shippingAddressData,
                    token: token,
                }
            );
        } else if (!selectedBillingAddress && selectedShippingAddress) {
            // Case 3: Only selectedShippingAddress is present and a new billing address is selected
            if (selectedOption === "new") {
                billingAddressData = newFields;
            } else {
                billingAddressData = fields;
            }
            // Post billing address
            const token = sessionStorage.getItem("user-token");
            await axios.post(
                `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveBillingAddress`,
                {
                    billingAddress: billingAddressData,
                    token: token,
                }
            );
        } else {
            // General case: Handling skipShippingAddress and same option
            if (skipShippingAddress) {
                shippingAddressData = fields;
                billingAddressData = fields;
            } else {
                if (selectedOption === "same") {
                    shippingAddressData = fields;
                    billingAddressData = fields;
                } else {
                    if (selectedOption === "new") {
                        shippingAddressData = newFields;
                    } else {
                        shippingAddressData = fields;
                    }
                    billingAddressData = fields;
                }
            }

            // Post shipping address if not null and not already selected
            if (shippingAddressData !== null && !selectedShippingAddress) {
                const token = sessionStorage.getItem("user-token");
                await axios.post(
                    `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveShippingAddress`,
                    {
                        shippingAddress: shippingAddressData,
                        token: token,
                    }
                );
            }

            // Post billing address if not null and not already selected
            if (billingAddressData !== null && (!selectedBillingAddress || selectedOption === "new")) {
                const token = sessionStorage.getItem("user-token");
                await axios.post(
                    `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveBillingAddress`,
                    {
                        billingAddress: billingAddressData,
                        token: token,
                    }
                );
            }
        }

        const response = await axios.post(
            `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/paymentStripe`,
            {
                product: cartItems,
                from: "finalcheckoutpage",
            }
        );
        window.location.href = response.data.url;
    } catch (error) {
        console.error(
            "Error creating payment:",
            error.response ? error.response.data : error.message
        );
    }
};

  const [shippingaddress, setShippingAddress] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveShippingAddress`
      )
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const userid = sessionStorage.getItem("user-token");
          setShippingAddress(
            res.data.filter((item) => item.user_id === parseInt(userid))
          );
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });
  }, []);
  const [billingaddress, setBillingAddress] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_HOST}${process.env.REACT_APP_PORT}/saveBillingAddress`
      )
      .then((res) => {
        if (res.data !== "Fail" && res.data !== "Error") {
          const userid = sessionStorage.getItem("user-token");
          setBillingAddress(
            res.data.filter((item) => item.user_id === parseInt(userid))
          );
        }
      })
      .catch((error) => {
        console.log("Error fetching all products:", error);
      });
  }, []);

  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);

  const handleSelectShippingAddress = (address) => {
    setSelectedShippingAddress(address);
  };

  const handleSelectBillingAddress = (address) => {
    setSelectedBillingAddress(address);
  };

  const handleClick = () => {
    if (selectedShippingAddress && selectedBillingAddress) {
      setStep(5);
    } else if (selectedShippingAddress) {
      setStep(2);
    } else if (selectedBillingAddress) {
      setStep(3);
    } else {
      setNotification({
        message: "You need to select at least one address.",
        type: "error",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDivClick = (addressType, index) => {
    if (addressType === "shipping") {
      handleSelectShippingAddress(shippingaddress[index]);
    } else {
      handleSelectBillingAddress(billingaddress[index]);
    }
  };

  useEffect(() => {
    if (shippingaddress.length > 0) {
      setStep(1);
    } else {
      setStep(2);
    }
  }, [shippingaddress]);
  useEffect(() => {
    if (selectedBillingAddress && skipShippingAddress) {
      setSelectedShippingAddress(selectedBillingAddress);
    }
  }, [selectedBillingAddress, skipShippingAddress]);

  return (
    <>
      <MyNavbar />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="container mt-5">
        <form>
          <div
            className="mb-3 p-2"
            style={{
              backgroundColor: step === 1 ? "#f8f9f9" : "#e5e7e9 ",
              // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h1
              style={{
                color: step === 1 ? "black" : "black",
                fontSize: "20px",
              }}
            >
              Existing Addresses
            </h1>
            {step === 1 && (
              <>
                <div className="container">
                  <div className="row">
                    {/* Shipping Addresses */}
                    <div className="col-md-6">
                      <div className="d-md-flex flex-column">
                        <h2 style={{ fontSize: "18px" }}>Shipping Addresses</h2>
                        {shippingaddress.slice(0, 3).map((address, index) => (
                          <div
                            key={`shipping_${index}`}
                            className={`shipping-address border rounded p-3 ${
                              selectedShippingAddress === address
                                ? "selected"
                                : ""
                            }`}
                            style={{ maxHeight: "150px", overflowY: "auto" }}
                            onClick={() => handleDivClick("shipping", index)}
                          >
                            <h6>
                              <input
                                type="radio"
                                name="shippingAddress"
                                className="me-2"
                                checked={selectedShippingAddress === address}
                                onChange={() => {}}
                              />
                              Shipping Address {index + 1}
                            </h6>
                            <p>
                              {address.firstname} {address.lastname}
                            </p>
                            <p>Email: {address.email}</p>
                            <p>Phone: {address.phone}</p>
                            <p>
                              {address.address1} {address.address2}
                            </p>
                            <p>
                              {address.city}, {address.state}, {address.pincode}
                            </p>
                            <p>{address.country}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Billing Addresses */}
                    <div className="col-md-6">
                      <div className="d-flex flex-column">
                        <h2 style={{ fontSize: "18px" }}>Billing Addresses</h2>
                        {billingaddress.slice(0, 3).map((address, index) => (
                          <div
                            key={`billing_${index}`}
                            className={`billing-address border rounded p-3 ${
                              selectedBillingAddress === address
                                ? "selected"
                                : ""
                            }`}
                            style={{ maxHeight: "150px", overflowY: "auto" }}
                            onClick={() => handleDivClick("billing", index)}
                          >
                            <h6>
                              <input
                                type="radio"
                                name="billingAddress"
                                className="me-2"
                                checked={selectedBillingAddress === address}
                                onChange={() => {}}
                              />
                              Billing Address {index + 1}
                            </h6>
                            {/* Display address details */}
                            <p>
                              {address.firstname} {address.lastname}
                            </p>
                            <p>Email: {address.email}</p>
                            <p>Phone: {address.phone}</p>
                            <p>
                              {address.address1} {address.address2}
                            </p>
                            <p>
                              {address.city}, {address.state}, {address.pincode}
                            </p>
                            <p>{address.country}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 d-flex justify-content-between p-5">
                  <button
                    className="btn btn-primary mt-3 me-3"
                    onClick={handleClick}
                  >
                    <i className="bi bi-arrow-right-square me-1"></i>
                    Continue
                  </button>
                  <button
                    className="btn btn-secondary mt-3"
                    onClick={() => setStep(2)}
                  >
                    <i className="bi bi-skip-forward me-1"></i>
                    Skip
                  </button>
                </div>
              </>
            )}
          </div>

          <div
            className="mb-3"
            style={{
              backgroundColor: step === 2 ? "#f8f9f9" : "#e5e7e9 ",
              padding: "10px",
            }}
          >
            <h1
              style={{
                color: step === 2 ? "black" : "black",
                fontSize: "20px",
              }}
            >
              Billing Address
            </h1>
            {step === 2 && (
              <>
                {!selectedShippingAddress ? (
                  <div className="mb-3">
                    <input
                      type="checkbox"
                      checked={skipShippingAddress}
                      onChange={handleSkipShippingChange}
                      className="me-1"
                    />
                    <label>
                      <strong>Ship to the same Address</strong>
                    </label>
                  </div>
                ) : null}

                <div className="row g-2">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Firstname"
                      name="firstname"
                      value={fields.firstname}
                      onChange={handleInputChange}
                      required
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Lastname"
                      name="lastname"
                      value={fields.lastname}
                      onChange={handleInputChange}
                      required
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      value={fields.email}
                      onChange={handleInputChange}
                      required
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Country"
                      name="country"
                      value={fields.country}
                      onChange={handleInputChange}
                      readOnly
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <Select
                      options={stateOptions}
                      value={stateOptions.find(
                        (option) => option.value === fields.state
                      )}
                      onChange={handleChange}
                      placeholder="Select a state"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="City"
                      name="city"
                      value={fields.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Adress1"
                      name="address1"
                      value={fields.address1}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Adress2 (Optional)"
                      name="address2"
                      value={fields.address2}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ZIP Code"
                      name="pincode"
                      value={fields.pincode}
                      pattern="[0-9]{5}"
                      title="Please enter exactly 5 digits"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone"
                      name="phone"
                      value={fields.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary mt-3"
                  onClick={handleContinue}
                >
                  {" "}
                  <i className="bi bi-arrow-right-square me-1 me-1"></i>
                  Continue
                </button>
              </>
            )}
          </div>
          <div
            className="mb-3"
            style={{
              backgroundColor:
                step === 3 && !skipShippingAddress ? "#f8f9f9" : "#e5e7e9",
              padding: "10px",
            }}
          >
            <h1
              style={{
                color: step === 3 ? "black" : "black",
                fontSize: "20px",
              }}
            >
              Shipping Address
            </h1>

            {step === 3 && !skipShippingAddress && (
              <>
                <div className="mb-3">
                  <div>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          value="new"
                          checked={selectedOption === "new"}
                          onChange={handleCheckboxChange}
                        />
                        Add New Address
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          value="same"
                          checked={selectedOption === "same"}
                          onChange={handleCheckboxChange}
                        />
                        Use Same as Billing Address
                      </label>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}

                {selectedOption === "new" && (
                  <>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Firstname"
                          name="firstname"
                          value={newFields.firstname}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Lastname"
                          name="lastname"
                          value={newFields.lastname}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <input
                          type="email"
                          className="form-control mb-2"
                          placeholder="Email"
                          name="email"
                          value={newFields.email}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Country"
                          name="country"
                          value={newFields.country}
                          readOnly
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <Select
                          options={stateOptions}
                          value={stateOptions.find(
                            (option) => option.value === newFields.state
                          )}
                          onChange={(option) =>
                            setNewFields({
                              ...newFields,
                              state: option ? option.value : "",
                            })
                          }
                          placeholder="Select a state"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="City"
                          name="city"
                          value={newFields.city}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Address1"
                          name="address1"
                          value={newFields.address1}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Address2 (Optional)"
                          name="address2"
                          value={newFields.address2}
                          onChange={handleInputChange1}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="ZIP Code"
                          name="pincode"
                          value={newFields.pincode}
                          onChange={handleInputChange1}
                          pattern="[0-9]{5}"
                          title="Please enter exactly 5 digits"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Phone"
                          name="phone"
                          value={newFields.phone}
                          onChange={handleInputChange1}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedOption === "same" && (
                  <p>Shipping details will be the same as billing address.</p>
                )}

                <div className="col-12 d-flex justify-content-between p-5">
                  <button className="btn btn-secondary" onClick={handleBack}>
                    <i className="bi bi-arrow-left-square"></i> Back
                  </button>
                  <button
                    className="btn btn-primary me-2"
                    onClick={handleContinue}
                  >
                    <i className="bi bi-arrow-right-square me-1"></i> Continue
                  </button>
                </div>
              </>
            )}
          </div>

          <div
            className="mb-3"
            style={{
              backgroundColor: step === 4 ? "#f8f9f9" : "#e5e7e9",
              padding: "10px",
            }}
          >
            <h1
              style={{
                color: step === 4 ? "black" : "black",
                fontSize: "20px",
              }}
            >
              Payment Information
            </h1>
            {step === 4 && (
              <>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Product Image</th>
                      <th>Product Name</th>
                      <th>Product Quantity</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <img
                            src={`${JSON.parse(product.image)[0]}`}
                            alt={product.name}
                            style={{ maxWidth: "60px", maxHeight: "100px" }}
                          />
                        </td>
                        <td className="text-secondary">{product.name}</td>
                        <td>{product.quantity}</td>
                        <td> &#36;{product.price * product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="col-md-4 bg-white shadow float-md-end">
                  <div className="p-3 ">
                    <p className="mb-0 d-flex justify-content-between">
                      Sub-Total: <span>&#36;{totalPrice}.00</span>
                    </p>
                    <hr />
                    <p className="mb-0 fw-bold d-flex justify-content-between">
                      Total Price:{" "}
                      <span className="fw-light">&#36;{totalPrice}.00</span>
                    </p>
                  </div>
                </div>
                <div className="col-12 d-flex justify-content-between p-5">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={handleBack}
                  >
                    <i className="bi bi-arrow-left-square"></i> Back
                  </button>
                  <button className="btn btn-primary" onClick={handleContinue}>
                    <i className="bi bi-arrow-right-square me-1"></i> Continue
                  </button>
                </div>
              </>
            )}
          </div>

          <div
            className="mb-3"
            style={{
              backgroundColor: step === 5 ? "#f8f9f9" : "#e5e7e9 ",
              padding: "10px",
            }}
          >
            <h1
              style={{
                color: step === 5 ? "black" : "black",
                fontSize: "20px",
              }}
            >
              Confirm Order
            </h1>
            {step === 5 && (
              <>
                <div className="d-flex m-2" style={{ gap: "100px" }}>
                  <div style={{ padding: "10px" }}>
                    <h2 style={{ fontSize: "19px" }}>
                      <u>Billing Details</u>
                    </h2>
                    <div>
                      {selectedBillingAddress ? (
                        <>
                          <p className="fw-bold">
                            {selectedBillingAddress.firstname}{" "}
                            {selectedBillingAddress.lastname}
                          </p>
                          <p>
                            <b>Email: </b>
                            {selectedBillingAddress.email}
                          </p>
                          <p>
                            <b>Phone:</b> {selectedBillingAddress.phone}
                          </p>
                          <p>
                            {selectedBillingAddress.address1}{" "}
                            {selectedBillingAddress.address2}
                          </p>
                          <p>
                            {selectedBillingAddress.city},{" "}
                            {selectedBillingAddress.state},{" "}
                            {selectedBillingAddress.pincode}
                          </p>
                          <p>{selectedBillingAddress.country}</p>
                        </>
                      ) : (
                        <>
                          <p className="fw-bold">
                            {fields.firstname} {fields.lastname}
                          </p>
                          <p>
                            <b>Email:</b> {fields.email}
                          </p>
                          <p>
                            <b>Phone:</b> {fields.phone}
                          </p>
                          <p>
                            {fields.address1} {fields.address2}
                          </p>
                          <p>
                            {fields.city}, {fields.state}, {fields.pincode}
                          </p>
                          <p>{fields.country}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ padding: "10px" }}>
                    <h2 style={{ fontSize: "19px" }}>
                      <u>Shipping Details</u>
                    </h2>
                    <div>
                      {skipShippingAddress ? (
                        <>
                          <p className="fw-bold">
                            {fields.firstname} {fields.lastname}
                          </p>
                          <p >
                            <b>Email:</b> {fields.email}
                          </p>
                          <p>
                            <b>Phone:</b> {fields.phone}
                          </p>
                          <p>
                            {fields.address1} {fields.address2}
                          </p>
                          <p>
                            {fields.city}, {fields.state}, {fields.pincode}
                          </p>
                          <p>{fields.country}</p>
                        </>
                      ) : (
                        <>
                          {selectedShippingAddress ? (
                            <>
                              <p className="fw-bold">
                                {selectedShippingAddress.firstname}{" "}
                                {selectedShippingAddress.lastname}
                              </p>
                              <p>
                                <b>Email:</b> {selectedShippingAddress.email}
                              </p>
                              <p>
                                <b>Phone:</b> {selectedShippingAddress.phone}
                              </p>
                              <p>
                                {selectedShippingAddress.address1}{" "}
                                {selectedShippingAddress.address2}
                              </p>
                              <p>
                                {selectedShippingAddress.city},{" "}
                                {selectedShippingAddress.state},{" "}
                                {selectedShippingAddress.pincode}
                              </p>
                              <p>{selectedShippingAddress.country}</p>
                            </>
                          ) : (
                            <>
                              <p className="fw-bold">
                                {selectedOption === "new"
                                  ? newFields.firstname
                                  : fields.firstname}{" "}
                                {selectedOption === "new"
                                  ? newFields.lastname
                                  : fields.lastname}
                              </p>
                              <p>
                                <b>Email:{" "}</b>
                                {selectedOption === "new"
                                  ? newFields.email
                                  : fields.email}{" "}
                              </p>
                              <p>
                              <b> Phone:{" "}</b>
                                {selectedOption === "new"
                                  ? newFields.phone
                                  : fields.phone}
                              </p>
                              <p>
                                {selectedOption === "new"
                                  ? newFields.address1
                                  : fields.address1}{" "}
                                {selectedOption === "new"
                                  ? newFields.address2
                                  : fields.address2}
                              </p>
                              <p>
                                {selectedOption === "new"
                                  ? newFields.city
                                  : fields.city}{" "}
                                ,
                                {selectedOption === "new"
                                  ? newFields.state
                                  : fields.state}{" "}
                                ,
                                {selectedOption === "new"
                                  ? newFields.pincode
                                  : fields.pincode}
                              </p>
                              <p>
                                {selectedOption === "new"
                                  ? newFields.country
                                  : fields.country}
                              </p>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Product Image</th>
                      <th>Product Name</th>
                      <th>Product Quantity</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <img
                            src={`${JSON.parse(product.image)[0]}`}
                            alt={product.name}
                            style={{ maxWidth: "60px", maxHeight: "100px" }}
                          />
                        </td>
                        <td className="text-secondary">{product.name}</td>
                        <td>{product.quantity}</td>
                        <td>&#36;{product.price * product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="col-md-4 bg-white shadow float-md-end">
                  <div className="p-3 ">
                    <p className="mb-0 d-flex justify-content-between">
                      Sub-Total: <span>&#36;{totalPrice}.00</span>
                    </p>
                    <hr />
                    <p className="mb-0 fw-bold d-flex justify-content-between">
                      Total Price:{" "}
                      <span className="fw-light">&#36;{totalPrice}.00</span>
                    </p>
                  </div>
                </div>

                <div className="col-12 d-flex justify-content-between p-5">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={handleBack}
                    disabled={disabled}
                  >
                    <i className="bi bi-arrow-left-square"></i> Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={createPayment}
                    disabled={disabled}
                  >
                    <i className="bi bi-bag-check-fill me-1"></i>Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Checkout;
