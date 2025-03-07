"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import useBrandStore from "@/store/useBrandStore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const setLogoInStore = useBrandStore((state) => state.setLogo);
  const setBrandName = useBrandStore((state) => state.setBrandName);
  const setBrandId = useBrandStore((state) => state.setBrandId);

  const initialValues = {
    email: "",
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
    gstCertificate: Yup.mixed().required("GST certificate is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
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
      const gstCertificateType = gstCertificate.type;

      // Step 1: Generate upload URL for brand logo
      const logoResponse = await fetch(
        "https://fastapi.aroundme.tech/api/upload/generate-upload-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${brandName.replace(/\s+/g, "-").toLowerCase()}-logo`,
            type: brandLogoType,
            asset_for: "user-image",
          }),
        }
      );

      const logoData = await logoResponse.json();

      // Step 2: Generate upload URL for incorporation certificate
      const certificateResponse = await fetch(
        "https://fastapi.aroundme.tech/api/upload/generate-upload-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `${brandName.replace(/\s+/g, "-").toLowerCase()}-certificate`,
            type: gstCertificateType,
            asset_for: "user-image",
          }),
        }
      );

      const certificateData = await certificateResponse.json();

      // Step 3: Upload the brand logo
      await fetch(logoData.signed_url, {
        method: "PUT",
        headers: {
          "Content-Type": brandLogoType,
        },
        body: brandLogo,
      });

      // Step 4: Upload the GST certificate
      await fetch(certificateData.signed_url, {
        method: "PUT",
        headers: {
          "Content-Type": gstCertificateType,
        },
        body: gstCertificate,
      });

      // Step 5: Create brand with the uploaded files
      const brandData = {
        email: email,
        name: brandName,
        description: brandDescription,
        industry: businessDomain,
        website: website || "",
        logo: logoData.public_url,
        incoperation_certificate: certificateData.public_url,
        contact_person_name: contactName,
        contact_person_phone_number: contactPhone,
      };

      console.log("Creating brand with data:", brandData);

      const brandResponse = await fetch(
        `https://shoppie-backend.aroundme.global/api/brands/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(brandData),
        }
      );

      const brand = await brandResponse.json();
      console.log("Brand created:", brand);

      // Store important data in the store
      setLogoInStore(logoData.public_url);
      setBrandName(brandName);
      setBrandId(brand.id);

      // Navigate to the brand status page
      router.push("/brand-status");
    } catch (error) {
      console.error("Error during submission", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Rest of the component remains the same
  return (
    <div className="flex py-10 items-center justify-center bg-authBackground px-4">
      <div className="w-full max-w-lg rounded-2xl bg-authCard px-8 py-5 shadow-lg">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Create an Account 🚀
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Create an account to discover people, join conversations, and grow
          your network.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form className="mt-6 space-y-4">
              {/* Brand Logo Upload */}
              <div className="mt-4 flex flex-col items-center">
                <label htmlFor="brandLogo" className="cursor-pointer">
                  <div className="h-20 w-20 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center bg-authCard">
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
                <p className="mt-2 text-sm text-sky-500 cursor-pointer">
                  <span className="text-red-400">*</span> Brand logo
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium">
                  <span className="text-red-400">*</span> Email
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="mt-1 block text-sm w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
                  required
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
                  className="mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
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
                  <span className="text-red-400">*</span> Brand Description
                </label>
                <Field
                  as="textarea"
                  name="brandDescription"
                  placeholder="Enter brand description"
                  className="mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
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
                    className="p-2 bg-transparent text-sm text-white focus:outline-none rounded-xl focus:ring-0 focus:border-[#4d4d4d] w-full border border-[#2d2d2d] bg-gray-700 pr-10 outline-none appearance-none"
                  >
                    <option value="">Select Business domain</option>
                    <option value="Beauty & Self care">
                      Beauty & Self care
                    </option>
                    <option value="Pet care">Pet care</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Health & wellness">Health & wellness</option>
                    <option value="Food & beverages">Food & beverages</option>
                  </Field>
                  x
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
              <div>
                <label className="block text-xs font-medium text-gray-300">
                  Website
                </label>
                <Field
                  type="text"
                  name="website"
                  placeholder="Enter website URL"
                  className="mt-1 block text-sm w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
                />
                <ErrorMessage
                  name="website"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* GST Certificate Upload */}
              <div>
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
              </div>

              {/* Contact Person Details */}
              <div>
                <label className="block text-xs font-medium">
                  <span className="text-red-400">*</span> Contact person details
                </label>
                <div className="mt-1 flex gap-2">
                  <Field
                    type="text"
                    name="contactName"
                    placeholder="Name"
                    className="mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
                  />
                  <Field
                    type="text"
                    name="contactPhone"
                    placeholder="Phone number"
                    className="appearance-none mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
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
                  className="h-4 w-4 rounded-xl border border-neutral-800 bg-red-600 text-blue-500 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500"
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
                disabled={isSubmitting}
                className="mt-4 w-full rounded-xl bg-neutral-600 text-sm py-2 text-white font-semibold hover:bg-gray-500 transition"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
