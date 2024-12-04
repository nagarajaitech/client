

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/index";
import { editProduct } from "../slices/productEditSlice";
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Card,
  CardMedia,
  Typography
} from "@mui/material";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Define the interface for Product
interface Product {
  _id: string;
  productname: string;
  description: string;
  price: number;
  imageUrls: string[];
  stock: number;
}

interface FormData {
  productname: string;
  description: string;
  price: string;
  stock: number;
  images: FileList | null;
}

interface ProductEditFormProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({ open, onClose, product }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.productEdit);
  const BASE_URL = "http://localhost:5000";

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setValue("productname", product.productname);
      setValue("description", product.description);
      setValue("price", product.price.toString());
      setValue("stock", product.stock);
      setSelectedImages(product.imageUrls);
    }
  }, [product, setValue]);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const urls = files.map(file => URL.createObjectURL(file));
      setSelectedImages(urls);
    }
  };

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("productname", data.productname);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stock", data.stock.toString());
    if (data.images) {
      Array.from(data.images).forEach((file) => {
        formData.append("images", file);
      });
    }

    if (product) {
      dispatch(editProduct({ id: product._id, formData }))
        .then(() => {
          reset();
          onClose();
        })
        .finally(() => {
          if (error) {
            toast.error(error);
          } else {
            // Log updated image URLs
            console.log("Updated Images:", selectedImages);
          }
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth sx={{ borderRadius:20}}>
      <DialogTitle sx={{ bgcolor: "#4CAF50", color: "#FFFFFF", textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>
        Update Product
      </DialogTitle>
      <DialogContent sx={{ bgcolor: "#F1F8E9" }}>
        <Box
          sx={{
            maxWidth: 300,
            margin: "auto",
            padding: 2,
            border: "1px solid #8BC34A",
            borderRadius: "18px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Product Name"
              {...register("productname", { required: "Product name is required" })}
              margin="normal"
              error={!!errors.productname}
              helperText={errors.productname?.message}
              sx={{ input: { color: "#4CAF50" },}}
            />
            <TextField
              fullWidth
              label="Description"
              {...register("description", { required: "Description is required" })}
              margin="normal"
              multiline
              rows={1}
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{ input: { color: "#4CAF50" },  }}
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              {...register("price", { required: "Price is required" })}
              margin="normal"
              error={!!errors.price}
              helperText={errors.price?.message}
              sx={{ input: { color: "#4CAF50" },  }}
            />
            <TextField
              fullWidth
              label="Stock"
              type="number"
              {...register("stock", { required: "Stock is required", valueAsNumber: true })}
              margin="normal"
              error={!!errors.stock}
              helperText={errors.stock?.message}
              sx={{ input: { color: "#4CAF50" },   }}
            />

            <Box sx={{ mt: 2 }}>
              
              <Grid container spacing={2}>
                {selectedImages.map((url, index) => (
                  <Grid item xs={4} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={url.startsWith('http') ? url : `${BASE_URL}/${url}`}
                        alt="product image"
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <input
              type="file"
              multiple
              accept="image/*"
              {...register("images")}
              onChange={onImageChange}
              style={{ margin: "20px 0", backgroundColor: "#C8E6C9" }}
            />
            <Typography variant="body2" sx={{ color: "#4CAF50", textAlign: 'center' }}>
              Upload new images to replace current ones
            </Typography>

            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              disabled={loading}
              sx={{ mt: 2, bgcolor: "#4CAF50", color: "#FFFFFF", "&:hover": { bgcolor: "#388E3C" } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Update Product"}
            </Button>
          </form>
        </Box>
      </DialogContent>
      <DialogActions sx={{ bgcolor: "#4CAF50" , display:'flex',justifyContent:'center'}}>
        <Button onClick={onClose} sx={{ color: "white", fontWeight:'bold' , textAlign:'center'}}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductEditForm;

