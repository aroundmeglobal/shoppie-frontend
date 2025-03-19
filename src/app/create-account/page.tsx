"use client";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import * as Yup from "yup";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import useBrandStore from "@/store/useBrandStore";
import { useRouter } from "next/navigation";
import Navbar from "@/component/Navbar";
import { useRef } from "react";
import api from "@/lib/axiosInstance";
import Cookies from "js-cookie";

export default function RegisterPage() {
  const router = useRouter();
  const email = useBrandStore((state) => state.email);
  const setLogoInStore = useBrandStore((state) => state.setLogo);
  const setBrandName = useBrandStore((state) => state.setBrandName);
  const setBrandId = useBrandStore((state) => state.setBrandId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialValues = {
    email: email,
    brandName: "",
    brandDescription: "",
    businessDomain: "",
    website: "",
    contactName: "",
    contactPhone: "",
    acceptedTerms: false,
    brandLogo: null,
    gstCertificate: null,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    brandName: Yup.string().required("Brand name is required"),
    brandDescription: Yup.string().required("Brand description is required"),
    businessDomain: Yup.string().required("Business domain is required"),
    website: Yup.string().url("Enter a valid URL").nullable(),
    contactName: Yup.string().required("Contact name is required"),
    contactPhone: Yup.string().required("Contact phone is required"),
    acceptedTerms: Yup.boolean().oneOf(
      [true],
      "You must accept the terms and conditions"
    ),
    brandLogo: Yup.mixed().required("Brand logo is required"),
    // gstCertificate: Yup.mixed().required("GST certificate is required"),
  });

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current?.click();
    }
  };

  const handleSubmit = async (
    values: FormikValues,
    {
      setSubmitting: setSubmitting,
    }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      // Destructure values for easier access
      const {
        brandLogo,
        gstCertificate,
        brandName,
        brandDescription,
        businessDomain,
        website,
        contactName,
        contactPhone,
        email,
      } = values;

      // Get file types
      const brandLogoType = brandLogo.type;
      // const gstCertificateType = gstCertificate.type;

      // Step 1: Generate upload URL for brand logo
      const logoResponse = await fetch(
        `${process.env.NEXT_PUBLIC_DEVBASEURL}/upload/generate-upload-url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${brandName.replace(/\s+/g, "-").toLowerCase()}-logo`,
            contentType: brandLogoType,
            folder: "user-image",
          }),
        }
      );

      const logoData = await logoResponse.json();




      // // Step 3: Upload the brand logo
      await fetch(logoData.signed_url, {
        method: "PUT",
        headers: {
          "Content-Type": brandLogoType,
        },
        body: brandLogo,
      });

      // // Step 4: Upload the GST certificate
      // await fetch(certificateData.signed_url, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": gstCertificateType,
      //   },
      //   body: gstCertificate,
      // });

      // Step 5: Create brand with the uploaded files
      const brandData = {
        email: email,
        name: brandName,
        description: brandDescription,
        industry: businessDomain,
        website: website || "",
        logo: logoData.public_url,
        // incoperation_certificate: certificateData.public_url,
        contact_person_name: contactName,
        contact_person_phone_number: contactPhone,
      };

      // const brandResponse = await fetch(
      //   `https://shoppie-backend.aroundme.global/api/brands/`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(brandData),
      //   }
      // );

      // const brand = await brandResponse.json();

      const brandResponse = await api.post(`/brands/`, brandData);
      const brand = await brandResponse.data;

      if (brand.token) {
        Cookies.set("authToken", brand.token, {
          expires: 365,
          secure: true, // Ensure it's only sent over HTTPS
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/", // Makes it available across the site
        });
      }
      // Store important data in the store
      setLogoInStore(logoData.public_url);
      setBrandName(brandName);
      setBrandId(brand.id);

      // Navigate to the brand status page
      // router.push("/brand-status");
      router.replace("/brand/profile");
      setSubmitting(false);
    } catch (error) {
      console.error("Error during submission", error);
      setSubmitting(false);
    }
  };

  // Rest of the component remains the same
  return (
    <main className="bg-[url(/login-background.png)] bg-fixed bg-cover min-h-screen flex flex-col">
      <Navbar />
      <div className="flex py-10 items-center justify-center rounded-2xl  px-4 ">
        <div className="w-[75%] max-w-5xl  flex  overflow-hidden shadow-lg rounded-2xl ">
          <div className="md:w-2/3 w-full   bg-[#161616] px-8 py-5 shadow-lg">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Create an Account 🚀
            </h2>
            <p className="mt-1 text-xs text-[#cacaca] text-[13px] font-extralight font-[BR Firma]">
              Create an account to discover people, join conversations, and grow
              your network.
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values, isSubmitting, isValid, dirty }) => (
                <Form className="mt-6 space-y-4 flex gap-10">
                  {/* Brand Logo Upload */}

                  <div className="mt-4 flex flex-col items-center space-y-3">
                    <label htmlFor="brandLogo" className="cursor-pointer">
                      <div className="h-20 w-20 rounded-full  border-dashed border-[#5a5a5a] border-opacity-50  border-[1px] flex items-center justify-center bg-authCard">
                        {values.brandLogo ? (
                          <img
                            src={URL.createObjectURL(values.brandLogo)}
                            alt="Brand Logo"
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">📷</span>
                        )}
                      </div>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="brandLogo"
                      className="hidden"
                      name="brandLogo"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFieldValue("brandLogo", e.target.files[0]);
                        }
                      }}
                    />
                    <ErrorMessage
                      name="brandLogo"
                      component="div"
                      className="text-red-500 text-sm"
                    />

                    <button
                      type="button"
                      onClick={handleButtonClick}
                      className="gap-2 bg-[#1d1d1d]  text-white  text-[13px] px-4 py-2 rounded-[12px] inline-flex items-center border-[#5a5a5a] border-[1px] border-opacity-50"
                    >
                      <span>Upload</span>
                      <MdOutlineFileUpload />
                    </button>
                    <span className="text-xs text-[#5a5a5a] text-center">
                      <span className="text-red-400">*</span> Upload your logo{" "}
                      <br /> (JPG/PNG)
                    </span>
                  </div>
                  <div className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium">Email</label>
                      <Field
                        // defaultValue={email}

                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        className="placeholder:text-[#5a5a5a] placeholder:text-sm mt-1 block text-sm w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
                        required
                        disabled
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Brand Name */}
                    <div>
                      <label className="block text-xs font-medium">
                        <span className="text-red-400">*</span> Brand Name
                      </label>
                      <Field
                        type="text"
                        name="brandName"
                        placeholder="Enter Brand Name"
                        className="placeholder:text-[#5a5a5a] placeholder:text-sm mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
                      />
                      <ErrorMessage
                        name="brandName"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Brand Description */}
                    <div>
                      <label className="block text-xs font-medium">
                        <span className="text-red-400">*</span> Brand
                        Description
                      </label>
                      <Field
                        as="textarea"
                        name="brandDescription"
                        placeholder="Enter brand description"
                        className="placeholder:text-[#5a5a5a] placeholder:text-sm mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
                        rows={4}
                      />
                      <ErrorMessage
                        name="brandDescription"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Business Domain */}
                    <div>
                      <label className="block text-xs font-medium">
                        <span className="text-red-400">*</span> Business domain
                      </label>
                      <div className="relative mt-1">
                        <Field
                          as="select"
                          name="businessDomain"
                          className="placeholder:text-[#5a5a5a] placeholder:text-sm p-2 bg-transparent text-sm text-white focus:outline-none rounded-xl focus:ring-0 focus:border-[#4d4d4d] w-full border border-[#2d2d2d] bg-gray-700 pr-10 outline-none appearance-none"
                        >
                          <option value="">Select Business domain</option>
                          <option value="Beauty & Self care">
                            Beauty & Self care
                          </option>
                          <option value="Pet care">Pet care</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Health & wellness">
                            Health & wellness
                          </option>
                          <option value="Food & beverages">
                            Food & beverages
                          </option>
                        </Field>

                        <FaChevronDown
                          size={12}
                          className="text-white absolute right-2 top-1/2 transform -translate-y-1/2"
                        />
                      </div>
                      <ErrorMessage
                        name="businessDomain"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Website */}
                    {/* <div>
                      <label className="block text-xs font-medium text-gray-300">
                        Website
                      </label>
                      <Field
                        type="text"
                        name="website"
                        placeholder="Enter website URL"
                        className="placeholder:text-[#5a5a5a] placeholder:text-sm mt-1 block text-sm w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
                      />
                      <ErrorMessage
                        name="website"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div> */}

                    {/* GST Certificate Upload */}
                    {/* <div>
                <label className="block text-xs font-medium">
                  <span className="text-red-400">*</span> Incorporation
                  certificate / GST
                </label>
                <div className="relative mt-1">
                  <input
                    type="file"
                    name="gstCertificate"
                    id="gstCertificate"
                    className="absolute text-sm inset-0 opacity-0 w-full h-full cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFieldValue("gstCertificate", e.target.files[0]);
                      }
                    }}
                  />
                  <div className="flex items-center bg-gray-700 mt-1 w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]">
                    <span className="flex-grow text-sm text-gray-400">
                      {values.gstCertificate
                        ? values.gstCertificate.name
                        : "Attach document here"}
                    </span>
                    <MdOutlineFileUpload />
                  </div>
                </div>
                <ErrorMessage
                  name="gstCertificate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div> */}

                    {/* Contact Person Details */}
                    <div>
                      <label className="block text-xs font-medium">
                        <span className="text-red-400">*</span> Contact person
                        details
                      </label>
                      <div className="mt-1 flex gap-2">
                        <Field
                          type="text"
                          name="contactName"
                          placeholder="Name"
                          className="placeholder:text-[#5a5a5a] placeholder:text-sm mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
                        />
                        <Field
                          type="text"
                          name="contactPhone"
                          placeholder="Phone number"
                          className="placeholder:text-[#5a5a5a] placeholder:text-sm appearance-none mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
                        />
                      </div>
                      <ErrorMessage
                        name="contactName"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                      <ErrorMessage
                        name="contactPhone"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex items-center gap-2">
                      <Field
                        type="checkbox"
                        name="acceptedTerms"
                        id="terms"
                        className="placeholder:text-[#5a5a5a] placeholder:text-sm h-4 w-4 rounded-xl border border-neutral-800 bg-red-600 text-blue-500 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500"
                      />
                      <label htmlFor="terms" className="text-sm text-white">
                        I accept{" "}
                        <span className="text-blue-400 cursor-pointer">
                          terms and conditions
                        </span>
                      </label>
                      <ErrorMessage
                        name="acceptedTerms"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Submit Button */}

                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className={`cursor-pointer mt-4 w-full rounded-xl text-sm py-2 font-semibold transition 
                        ${
                          isValid && dirty && !isSubmitting
                            ? "bg-[#00affe] hover:bg-[#00affe]"
                            : "bg-neutral-600 "
                        }
                         text-white`}
                    >
                      {isSubmitting ? "Creating account..." : "Create account"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          {/* Right Section */}
          <div className="w-1/2 bg-[#1f1f1f] md:flex hidden "></div>
        </div>
      </div>
    </main>
  );
}
