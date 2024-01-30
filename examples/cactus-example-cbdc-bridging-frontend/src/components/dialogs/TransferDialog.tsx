import { useState, useEffect, ChangeEvent } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Alert from "@mui/material/Alert";
import { transferTokensFabric } from "../../api-calls/fabric-api";
import { transferTokensBesu } from "../../api-calls/besu-api";

const recipients = ["Alice", "Charlie"];

export interface ITransferDialogOptions {
  open: boolean;
  ledger: string;
  user: string;
  balance: number;
  onClose: () => any;
}

export default function TransferDialog(props: ITransferDialogOptions) {
  const [errorMessage, setErrorMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (props.open) {
      setSending(false);
      setRecipient("");
      setAmount(0);
    }
  }, [props.open]);

  const handleChangeamount = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const value = parseInt(event.target.value);

    if (value < 0) {
      setErrorMessage("Amount must be a positive value");
      setAmount(0);
    } else {
      setErrorMessage("");
      setAmount(value);
    }

    if (value > props.balance) {
      setErrorMessage("Amount must be lower or equal to current balance");
      setAmount(props.balance);
    } else {
      setErrorMessage("");
      setAmount(value);
    }
  };

  const handleChangeRecipient = (event: SelectChangeEvent<string>) => {
    setRecipient(event.target.value);
  };

  const performLocalTransferTransaction = async () => {
    if (amount === 0) {
      setErrorMessage("Amounts must be a positive value");
    } else {
      setSending(true);

      if (props.ledger === "Fabric") {
        await transferTokensFabric(props.user, recipient, amount.toString());
      } else {
        await transferTokensBesu(props.user, recipient, amount);
      }
    }
    props.onClose();
  };

  return (
    <Dialog open={props.open} keepMounted onClose={props.onClose}>
      <DialogTitle>{"Transfer CBDC"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select the recipient of the tokens and the amount to transfer
        </DialogContentText>
        <Select
          fullWidth
          name="recipient"
          value={recipient}
          label="Recipient"
          variant="outlined"
          defaultValue={recipient}
          onChange={handleChangeRecipient}
        >
          {recipients.map((user) => (
            <MenuItem key={user} value={user}>
              {user}
            </MenuItem>
          ))}
        </Select>
        <TextField
          required
          fullWidth
          autoFocus
          id="amount"
          name="amount"
          value={amount}
          label="amount"
          type="number"
          placeholder="amount"
          variant="outlined"
          onChange={handleChangeamount}
          sx={{ margin: "1rem 0" }}
        />
        {errorMessage !== "" && (
          <Alert severity="error" sx={{ marginTop: "1rem" }}>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        {sending ? (
          <Button disabled>Sending...</Button>
        ) : (
          <div>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button onClick={performLocalTransferTransaction}>Confirm</Button>
          </div>
        )}
      </DialogActions>
    </Dialog>
  );
}
