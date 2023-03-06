import CheckOutWizard from "@/components/CheckOutWizard";
import Layout from "@/components/Layout";
import { Store } from "@/utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ShippingScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;

  const router = useRouter();

  useEffect(() => {
    if (shippingAddress) {
      setValue("fullName", shippingAddress.fullName);
      setValue("address", shippingAddress.address);
      setValue("city", shippingAddress.city);
      setValue("postalCode", shippingAddress.postalCode);
      setValue("country", shippingAddress.country);
    }
  }, [shippingAddress, setValue]);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );
    router.push("/payment");
  };

  return (
    <Layout>
      <CheckOutWizard activeStep={1} />
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="mx-auto-max-w-screen-md"
      >
        <h1 className="mb-4 text-xl">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            autoFocus
            className="w-full"
            {...register("fullName", {
              required: "Please enter full name",
            })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <h1 className="mb-4 text-xl">Address</h1>
        <div className="mb-4">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            autoFocus
            className="w-full"
            {...register("address", {
              required: "Please enter address",
              minLength: { value: 3, message: "Address is more than 3 chars" },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <h1 className="mb-4 text-xl">City</h1>
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            id="city"
            autoFocus
            className="w-full"
            {...register("city", {
              required: "Please enter city",
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <h1 className="mb-4 text-xl">Postal Code</h1>
        <div className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            id="postalCode"
            autoFocus
            className="w-full"
            {...register("postalCode", {
              required: "Please enter postal code",
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500">{errors.postalCode.message}</div>
          )}
        </div>
        <h1 className="mb-4 text-xl">Country</h1>
        <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            autoFocus
            className="w-full"
            {...register("country", {
              required: "Please enter country",
            })}
          />
          {errors.country && (
            <div className="text-red-500">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
}

ShippingScreen.auth = true;
