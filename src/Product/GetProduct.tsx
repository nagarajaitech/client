import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/index";
import { fetchProducts } from "../slices/productSlice";
import { deleteProduct } from "../slices/productDeleteSlice";
import ProductEditForm from "./ProductEditForm";
import ProductFilterForm from "./ProductFilterForm";

import {
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Stack,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { Product } from "../types";

const BASE_URL = "http://localhost:5000";

const ProductDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, loading, error } = useSelector((state: RootState) => state.products);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [page, setPage] = useState(1); // Start at page 1
  const rowsPerPage = 3; // Show 3 products per page

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpenDeleteDialog = (productId: string) => {
    setProductIdToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductIdToDelete(null);
  };

  const handleDeleteProduct = () => {
    if (productIdToDelete) {
      dispatch(deleteProduct(productIdToDelete)).then(() => {
        dispatch(fetchProducts());
      });
    }
    handleCloseDeleteDialog();
  };

  const handleOpenEditDialog = (product: Product) => {
    setProductToEdit(product);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setProductToEdit(null);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedProducts = products.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#F7EFE5">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" variant="h6" align="center" bgcolor="#F7EFE5" padding={2}>
        {error}
      </Typography>
    );

  return (
    <div style={{ backgroundColor: "#F7EFE5", padding: "20px" }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: "#4CAF50", fontWeight: "bold" }}>
        My Dashboard
      </Typography>
      <ProductFilterForm />

      {products.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ color: "#4CAF50" }}>
          No products available
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#4CAF50" }}>
                    Product Image
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#4CAF50" }}>
                    Product Name
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#4CAF50" }}>
                    Product Description
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#4CAF50" }}>
                    Product Price
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#4CAF50" }}>
                    Product Stock
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#4CAF50" }}>
                    Product Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.map((product) => {
                  let imageUrl = Array.isArray(product.images) && product.images.length > 0
                    ? product.images[0]
                    : null;

                  if (imageUrl && !imageUrl.startsWith("http")) {
                    imageUrl = `${BASE_URL}${imageUrl}`;
                  }

                  return (
                    <TableRow key={product._id}>
                      <TableCell align="center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.productname}
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </TableCell>
                      <TableCell align="center">{product.productname}</TableCell>
                      <TableCell align="center">{product.description}</TableCell>
                      <TableCell align="center">${product.price.toFixed(2)}</TableCell>
                      <TableCell align="center">{product.stock}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => handleOpenEditDialog(product)}
                          sx={{ mr: 1, bgcolor: "#4CAF50", color: "white" }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ bgcolor: "#FF2929", color: "white" }}
                          onClick={() => handleOpenDeleteDialog(product._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Stack spacing={2} direction="row" justifyContent="center" sx={{ mt: 4 }}>
            <Pagination
              count={Math.ceil(products.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </>
      )}

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{"Delete Workflow"}</DialogTitle>
        <DialogContent sx={{ width: 300 }}>
          <DialogContentText>Are you sure you want to delete this product?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteProduct} sx={{ color: "red" }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ProductEditForm open={editDialogOpen} onClose={handleCloseEditDialog} product={productToEdit} />
    </div>
  );
};

export default ProductDashboard;
