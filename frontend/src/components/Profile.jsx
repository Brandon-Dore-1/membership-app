import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import "./Profile.css";
import { checkDate, convertDate } from "../utils";
import { modalBox, sharpButton, smallModalBox } from "../MuiStyles";
import ProfilePreview from "./ProfilePreview";
import CreateCustomer from "./CreateCustomer";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import ErrorIcon from "@mui/icons-material/Error";

const Profile = ({ customerID, closeModal, nested = false }) => {
  const [user, setUser] = useState(null);
  const [newCoupleID, setNewCoupleID] = useState("");
  const [coupleID, setCoupleID] = useState(0);
  const [couples, setCouples] = useState([]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openBan, setOpenBan] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (customerID !== null) {
      getUser();
      getCouples();
    }
  }, []);

  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => {
    getUser();
    setOpenEdit(false);
  };

  const handleClose = () => {
    setOpen(false);
    getCouples();
  };

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleOpenBan = () => {
    setOpenBan(true);
  };
  const handleCloseBan = () => {
    setOpenBan(false);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleOpenPreview = () => {
    if (newCoupleID !== "") {
      setShowPreview(true);
      setError("");
      return;
    }
    setError("Please enter a customer ID");
  };

  const getUser = () => {
    axios
      .get(`http://localhost:3000/customers/${customerID}`)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setUser(data[0]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteUser = () => {
    axios
      .delete(`http://localhost:3000/customers/${customerID}`)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setUser(data[0]);
        handleCloseDelete();
        closeModal();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const banUser = () => {
    let endpoint = "ban";
    if (user.is_banned) {
      endpoint = "unban";
    }
    axios
      .delete(`http://localhost:3000/customers/${customerID}/${endpoint}`)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        getUser();
        handleCloseBan();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getCouples = () => {
    axios
      .get(`http://localhost:3000/couples/${customerID}`)
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setCouples(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addCouple = () => {
    if (newCoupleID) {
      axios
        .post(`http://localhost:3000/couples`, {
          customer_1: customerID,
          customer_2: newCoupleID,
        })
        .then((response) => {
          setError("");
          setShowPreview(false);
          getCouples();
        });
    } else {
      setError("Please enter a customer ID");
    }
  };

  const deleteCouple = () => {
    if (coupleID) {
      axios
        .post("http://localhost:3000/couples/delete", {
          customer_1: customerID,
          customer_2: coupleID,
        })
        .then((response) => {
          handleClose();
          closeModal();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleCheckIn = () => {
    axios
      .post(`http://localhost:3000/dates/${customerID}`)
      .then((res) => {
        closeModal();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getPartner = (idArr) => {
    return idArr[0] == customerID ? idArr[1] : idArr[0];
  };

  return (
    <>
      {user != null ? (
        <div>
          <Button
            variant="contained"
            onClick={closeModal}
            sx={{ ...sharpButton, width: "15%" }}
          >
            Back
          </Button>
          <div className="actionButtons">
            <Button
              variant="contained"
              onClick={handleCheckIn}
              sx={{ ...sharpButton, width: "10rem" }}
              color="info"
            >
              Check-In Customer
            </Button>
            <Button
              variant="outlined"
              onClick={handleOpenEdit}
              sx={{ ...sharpButton, width: "10rem" }}
              color="info"
            >
              Edit Customer
            </Button>
            <Button
              variant="outlined"
              onClick={handleOpenBan}
              sx={{ ...sharpButton, width: "10rem" }}
              color={user.is_banned ? "info" : "error"}
            >
              {user.is_banned ? "Unban Customer" : "Ban Customer"}
            </Button>
            <Button
              variant="outlined"
              onClick={handleOpenDelete}
              sx={{ ...sharpButton, width: "10rem" }}
            >
              Delete Customer
            </Button>
          </div>
          <div className="profileTitle">
            <Typography variant="h1">Profile</Typography>
            {user.is_banned ? (
              <div className="profileAnnotation">
                <Typography variant="h2">
                  <RemoveCircleIcon /> Banned
                </Typography>
              </div>
            ) : (
              user.is_member && (
                <div className="profileAnnotation member">
                  <Typography variant="h2">
                    <FavoriteIcon /> Member
                  </Typography>
                </div>
              )
            )}
          </div>
          <div className="profileContent">
            <div className="left">
              <div>
                <Typography variant="h2">
                  Customer ID: <strong>{user.id}</strong>
                </Typography>
              </div>
              <hr style={{ width: "100%" }} />
              <div>
                <Typography variant="h2">Name</Typography>
                <Typography>
                  {user.first_name} {user.last_name}
                </Typography>
              </div>
              <div>
                <Typography variant="h2">Date of Birth</Typography>
                <Typography>
                  {convertDate(user.birth_date ? user.birth_date : "Unknown")}
                </Typography>
              </div>
              {user.expiry_date && (
                <div>
                  <Typography variant="h2">Expiry Date</Typography>
                  <Typography>
                    {convertDate(user.expiry_date)}
                    {checkDate(user.expiry_date) && (
                      <ErrorIcon
                        sx={{
                          color: "firebrick",
                          verticalAlign: "top",
                          marginLeft: "0.3rem",
                        }}
                      />
                    )}
                  </Typography>
                </div>
              )}
              {user.id_number && (
                <div>
                  <Typography variant="h2">Licence/Passport Number</Typography>
                  <Typography>{user.id_number}</Typography>
                </div>
              )}
              {user.notes && (
                <div>
                  <Typography variant="h2">Notes</Typography>
                  <Typography>{user.notes}</Typography>
                </div>
              )}
              {couples.length !== 0 && (
                <div>
                  <Typography variant="h2">Partners</Typography>
                  <div className="partnersContainer">
                    {couples.map((couple) => {
                      let partner = getPartner(Object.values(couple));
                      return !nested ? (
                        <div
                          className="partnerBox clickable"
                          onClick={() => {
                            setOpen(true);
                            setCoupleID(partner);
                          }}
                          key={partner}
                        >
                          <Typography className="partnerContent">
                            {partner}
                          </Typography>
                        </div>
                      ) : (
                        <div key={partner} className="partnerBox">
                          <Typography className="partnerContent">
                            {partner}
                          </Typography>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="right">
              <div
                className={`photoContainer ${
                  user.photo === null ? "centered" : ""
                }`}
              >
                {user.photo !== null ? (
                  <img
                    key={user.customer_id}
                    src={`data:image/jpeg;base64,${user.photo}`}
                    alt="photo"
                  />
                ) : (
                  <div className="photoMessage">
                    <Typography>No Photo Found</Typography>
                  </div>
                )}
              </div>
              <Typography variant="h2">Add Couple</Typography>

              <form
                className="inputContainer"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleOpenPreview();
                }}
              >
                <OutlinedInput
                  sx={{ width: "20rem" }}
                  id="couple_id"
                  type="number"
                  variant="outlined"
                  placeholder="Couple ID"
                  onChange={(e) => setNewCoupleID(e.target.value)}
                />
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenPreview();
                  }}
                >
                  Add Couple
                </Button>
              </form>
              {error && (
                <p className="errorMessage">Please enter a customer ID</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Typography>No profile selected</Typography>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="Open Profile"
        aria-describedby="Open Profile"
      >
        <div>
          <Box sx={modalBox}>
            <Profile
              customerID={coupleID}
              closeModal={handleClose}
              nested={true}
            />
            <br />
            <div className="removePartnerBtn">
              <Button onClick={deleteCouple} variant="contained" color="error">
                Remove Partner
              </Button>
            </div>
          </Box>
        </div>
      </Modal>
      <Modal
        open={showPreview}
        onClose={handleClosePreview}
        aria-labelledby="Couple Profile"
        aria-describedby="Couple Profile"
      >
        <div>
          <Box sx={smallModalBox}>
            <ProfilePreview
              customerID={newCoupleID}
              closeModal={handleClosePreview}
            />
            <div className="confirmContainer">
              <Typography>Is this the user you are looking for? </Typography>
              <div className="confirmButtons">
                <Button onClick={addCouple} variant="contained">
                  Confirm
                </Button>
                <Button onClick={handleClosePreview}>Cancel</Button>
              </div>
            </div>
          </Box>
        </div>
      </Modal>
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="Confirm Check In"
        aria-describedby="Confirm Check In"
      >
        <Box sx={modalBox}>
          <CreateCustomer {...user} closeModal={handleCloseEdit} />
        </Box>
      </Modal>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="confirm-delete-user"
        aria-describedby="confirm-delete-user"
      >
        <DialogTitle id="confirm-delete-user">Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-user">
            <Typography>Would you like to delete this user?</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={deleteUser} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openBan}
        onClose={handleCloseBan}
        aria-labelledby="confirm-delete-user"
        aria-describedby="confirm-delete-user"
      >
        <DialogTitle id="confirm-delete-user">Ban User</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-user">
            <Typography>
              {user != null && user.is_banned
                ? "Would you like to un-ban this user"
                : "Would you like to ban this user"}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseBan}>
            Cancel
          </Button>
          <Button variant="outlined" onClick={banUser} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
