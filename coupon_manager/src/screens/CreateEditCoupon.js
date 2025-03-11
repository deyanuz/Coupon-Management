import { useState } from "react";
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  TextField,
  MenuItem,
  Divider,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function CreateEditCoupon({ selectedCoupon, onSave, onBack }) {
  const [formData, setFormData] = useState(
    selectedCoupon
      ? {
          code: selectedCoupon.code,
          type: selectedCoupon.type,
          status: selectedCoupon.status,
          expired_date: dayjs(selectedCoupon.expired_date),
        }
      : {
          code: "",
          type: "percentage",
          status: "active",
          expired_date: dayjs(),
        }
  );

  const isDateExpired = (date) => {
    return dayjs(date).isBefore(dayjs(), "day");
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ borderRadius: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            {selectedCoupon ? "Edit Coupon" : "Create New Coupon"}
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box
          component="form"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          <TextField
            label="Coupon Code"
            fullWidth
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            sx={{ gridColumn: { xs: "1", md: "1" } }}
          />
          <TextField
            select
            label="Type"
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            sx={{ gridColumn: { xs: "1", md: "2" } }}
          >
            <MenuItem value="percentage">Percentage</MenuItem>
            <MenuItem value="fixed_amount">Fixed Amount</MenuItem>
            <MenuItem value="free_shipping">Free Shipping</MenuItem>
          </TextField>
          <TextField
            select
            label="Status"
            fullWidth
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            sx={{ gridColumn: { xs: "1", md: "1" } }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Expiry Date"
              value={formData.expired_date}
              onChange={(newValue) => {
                setFormData({ ...formData, expired_date: newValue });
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: isDateExpired(formData.expired_date),
                  helperText: isDateExpired(formData.expired_date)
                    ? "Warning: This date has already passed"
                    : "",
                },
              }}
              sx={{ gridColumn: { xs: "1", md: "2" } }}
            />
          </LocalizationProvider>
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}
        >
          <Button variant="outlined" onClick={onBack} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ borderRadius: 2 }}
          >
            {selectedCoupon ? "Update Coupon" : "Create Coupon"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreateEditCoupon;
