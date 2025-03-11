import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import "./App.css";
import CreateEditCoupon from "./screens/CreateEditCoupon";

import axios from "axios";

function App() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isCreateEdit, setIsCreateEdit] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://127.0.0.1:8000/coupons"); // Replace with actual API URL
      setCoupons(response.data["data"]);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch coupons");
      setSnackbar({
        open: true,
        message: "Failed to fetch coupons. Please try again later.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (formData) => {
    if (selectedCoupon) {
      // Update existing coupon
      setCoupons(
        coupons.map((c) =>
          c.id === selectedCoupon.id
            ? {
                ...c,
                ...formData,
                expired_date: formData.expired_date.format("YYYY-MM-DD"),
              }
            : c
        )
      );
      setSnackbar({
        open: true,
        message: "Coupon updated successfully!",
        severity: "success",
      });
    } else {
      // Create new coupon
      const newCoupon = {
        id: Math.max(...coupons.map((c) => c.id)) + 1,
        ...formData,
        expired_date: formData.expired_date.format("YYYY-MM-DD"),
        created_at: new Date().toISOString(),
      };
      setCoupons([...coupons, newCoupon]);
      setSnackbar({
        open: true,
        message: "Coupon created successfully!",
        severity: "success",
      });
    }
    handleBack();
  };

  const handleBack = () => {
    setIsCreateEdit(false);
    setSelectedCoupon(null);
  };

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setIsCreateEdit(true);
  };

  const handleDelete = (id) => {
    setCoupons(coupons.filter((c) => c.id !== id));
    setSnackbar({
      open: true,
      message: "Coupon deleted successfully!",
      severity: "success",
    });
  };

  const isDateExpired = (date) => {
    return dayjs(date).isBefore(dayjs(), "day");
  };

  if (isCreateEdit) {
    return (
      <CreateEditCoupon
        selectedCoupon={selectedCoupon}
        onSave={handleSave}
        onBack={handleBack}
      />
    );
  }
  // console.log(document.cookie);
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1">
          Coupon Manager
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateEdit(true)}
          sx={{ borderRadius: 2 }}
        >
          Create New Coupon
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Code</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Expiry Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell align="center">{coupon.id}</TableCell>
                  <TableCell align="center">{coupon.code}</TableCell>
                  <TableCell
                    align="center"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {coupon.type.replace("_", " ")}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      component="span"
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor:
                          coupon.status === "active"
                            ? "success.light"
                            : coupon.status === "inactive"
                            ? "warning.light"
                            : "error.light",
                        color: "white",
                      }}
                    >
                      {coupon.status}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        color: isDateExpired(coupon.expired_date)
                          ? "error.main"
                          : "inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      {dayjs(coupon.expired_date).format("MMMM D, YYYY")}
                      {isDateExpired(coupon.expired_date) && (
                        <Typography variant="caption" color="error">
                          (Expired)
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(coupon)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(coupon.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
