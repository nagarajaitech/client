import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/index";
import { fetchFilteredProducts } from "../slices/productSlice";
import { Button, TextField, Box } from "@mui/material";

interface FormData {
  productname: string;
  createdDate: string;
  stock?: string; // Make stock optional
}

const ProductFilterForm: React.FC = () => {
  const { register, handleSubmit,  } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
    // Dispatch filter action with the form data
    dispatch(fetchFilteredProducts(data));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap'  }}
    >
      <TextField
        label="Product Name"
        {...register("productname")}
        sx={{ flex: 1, minWidth: '200px',height:30 }}
      />
      <TextField
        label="Created Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        {...register("createdDate")}
        sx={{ flex: 1, minWidth: '200px' ,height:30}}
      />
      <TextField
        label="Stock"
        type="number"
        {...register("stock")}
        sx={{ flex: 1, minWidth: '200px',height:30, }}
      />
      <Button type="submit" variant="contained" sx={{bgcolor:'#4CAF50', color:'white' ,height:40, marginTop:1 }}>
        Filter
      </Button>
      {/* <Button type="button" variant="contained" sx={{bgcolor:'#B8001F', color:'white'}} onClick={() => reset()}>
        Reset
      </Button> */}
    </Box>
  );
};

export default ProductFilterForm;
