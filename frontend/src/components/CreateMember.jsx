import { Button, InputLabel, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { useState } from "react";
import Webcam from "react-webcam";
import { sharpButton, textField } from "../MuiStyles";
import "./CreateMember.css";
import { convertDate } from "../utils";

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

const CreateMember = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [exp, setExp] = useState("");
  const [sex, setSex] = useState("");
  // const [relationshipStatus, setRelationshipStatus] = useState("");
  const [pic, setPic] = useState("");
  const [notes, setNotes] = useState("");

  const checkEmpty = () => {
    return !firstName || !lastName || !dob || !exp || !pic;
  };

  const calcExpiry = (increment) => {
    let date = new Date();
    let expiryDate = new Date(date.setMonth(date.getMonth() + increment));
    return expiryDate.toISOString().split("T")[0];
  };

  const handleSubmit = () => {
    const formdata = {
      first_name: firstName,
      last_name: lastName,
      birth_date: dob,
      expiry_date: exp,
      sex: sex,
      // When a couple is added, update to be Couple
      relationship_status: "Single",
      photo: pic,
      notes: notes ? notes : "",
    };
    axios
      .post("http://localhost:3000/members", formdata)
      .then((res) => {
        console.log(res);
        location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <Typography variant="h1">Create Member</Typography>
      <div className="modalContent">
        <form className="formContainer">
          <div className="inputFields">
            <TextField
              onChange={(e) => setFirstName(e.target.value)}
              sx={textField}
              id="first_name"
              label="First Name"
              variant="outlined"
            />
            <TextField
              onChange={(e) => setLastName(e.target.value)}
              sx={textField}
              id="last_name"
              label="Last Name"
              variant="outlined"
            />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="D.O.B."
                onChange={(e) => setDob(e.format("yyyy-MM-DD"))}
              />
            </LocalizationProvider>
            <div>
              <Typography style={{ marginTop: 0 }}>
                <strong>Expires in:</strong>
              </Typography>
              <div className="expiryPicker">
                <Button
                  variant="outlined"
                  onClick={() => setExp(calcExpiry(1))}
                >
                  1 Months
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setExp(calcExpiry(3))}
                >
                  3 Months
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setExp(calcExpiry(6))}
                >
                  6 Months
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setExp(calcExpiry(12))}
                >
                  1 Year
                </Button>
              </div>
              {exp && (
                <Typography>
                  <strong>Expires on {convertDate(exp)}</strong>
                </Typography>
              )}
            </div>
            <FormControl>
              <InputLabel variant="filled">Sex</InputLabel>
              <Select value={sex} onChange={(e) => setSex(e.target.value)}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            {/* <FormControl>
              <InputLabel variant="filled">Relationship Status</InputLabel>

              <Select
                value={relationshipStatus}
                onChange={(e) => setRelationshipStatus(e.target.value)}
              >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Couple">Couple</MenuItem>
              </Select>
            </FormControl> */}
          </div>
          <div className="photoContainer">
            {pic == "" ? (
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              >
                {({ getScreenshot }) => {
                  return (
                    <Button
                      sx={sharpButton}
                      onClick={() =>
                        setPic(btoa(getScreenshot().split(",")[1]))
                      }
                      variant="contained"
                    >
                      Take Picture
                    </Button>
                  );
                }}
              </Webcam>
            ) : (
              <>
                <img
                  src={`data:image/jpeg;base64,${atob(pic)}`}
                  alt="Picture"
                />
                <Button
                  sx={sharpButton}
                  onClick={() => setPic("")}
                  variant="contained"
                >
                  Retake Picture
                </Button>
              </>
            )}
          </div>
          <div className="notesContainer">
            <TextField
              sx={{ width: "60%" }}
              multiline
              label="Notes (Optional)"
              placeholder="Notes..."
              rows={4}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </form>
        <Button
          disabled={checkEmpty()}
          onClick={handleSubmit}
          color="info"
          variant="contained"
        >
          Create Member
        </Button>
      </div>
    </>
  );
};

export default CreateMember;
