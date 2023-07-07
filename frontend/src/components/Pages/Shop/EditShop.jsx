import React, { useEffect, useState } from "react";
import InstructionCardShopOwner from "./InstructionCardShopOwner";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Buffer } from "buffer";
import Loader from "../../UI-elements/Loader";

export default function EditShop() {
  const [shopId] = useState(localStorage.getItem("SHOP_ID"));

  const [shop, setShop] = useState(null);
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [activeHour, setActiveHour] = useState("");
  const [shopImage, setShopImage] = useState(null);
  const [previewURL, setPreviewURL] = useState("");

  const navigator = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/api/shops/${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        setShop(data);

        setName(data.SHOP_NAME);
        setDistrict(data.SHOP_LOCATION_DISTRICT);
        setCity(data.SHOP_LOCATION_CITY);
        setArea(data.SHOP_LOCATION_AREA);
        setActiveHour(data.SHOP_ACTIVE_HOURS);
        const base64Image = Buffer.from(data.SHOP_IMAGE.data).toString(
          "base64"
        );

        // Create the image source with the Base64-encoded image data
        setShopImage(`data:image/jpeg;base64,${base64Image}`);
      });
  }, [shopId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      setPreviewURL(reader.result);
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleUpdateShop = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const district = e.target.district.value;
    const city = e.target.city.value;
    const area = e.target.area.value;
    const activeHour = e.target.activeHour.value;
    const image = e.target.shopImage.files[0];

    const shopData = {
      shop_id: shop.SHOP_ID,
      name,
      district,
      city,
      area,
      activeHour,
    };

    console.log(shopData);

    const formData = new FormData();
    formData.append("shop_id", shop.SHOP_ID);
    formData.append("name", name);
    formData.append("district", district);
    formData.append("city", city);
    formData.append("area", area);
    formData.append("activeHour", activeHour);
    formData.append("image", image);

    const response = await fetch("http://localhost:3000/api/shop/update", {
      method: "PUT",
      body: formData,
    });

    const result = await response.json();
    console.log("Success:", result);
    if (result.shopUpdated) {
      toast("Shop Updated Successfully!!", {
        autoClose: 3000,
        type: "success",
        theme: "colored",
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  if (!shop) {
    return <Loader />;
  }

  return (
    <div className="max-w-[85%] mx-auto mt-10">
      <div>
        <div className="grid grid-cols-3 space-x-16">
          <div className="col-span-2">
            <form
              onSubmit={handleUpdateShop}
              className="grid grid-cols-2 gap-10"
            >
              <div className="flex col-span-full justify-between">
                <div className="flex gap-8 items-center">
                  <Link to="/shop-owner/shop-list" className="">
                    <ArrowLeftIcon className="h-6 w-6" />
                  </Link>
                  <h1 className="text-3xl font-bold">Edit Shop</h1>
                </div>
                <div>
                  <button
                    type="submit"
                    class="inline-flex justify-center h-12 w-full text-center sm:w-auto items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 sm:ml-3"
                  >
                    Update Shop Details
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <label
                    for="name"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Shop Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    name="name"
                    id="name"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="PrintPulse Studio"
                    required={true}
                  />
                </div>
                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Shop Image
                  </label>
                  <div class="flex items-center justify-center w-full">
                    <label
                      for="dropzone-file"
                      class="flex flex-col items-center justify-center w-full h-46 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div class="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          aria-hidden="true"
                          class="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span class="font-semibold">Click to upload</span> or
                          drag and drop
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          JPEG Only
                        </p>
                      </div>
                      <input
                        type="file"
                        id="dropzone-file"
                        name="shopImage"
                        class="hidden"
                        accept="image/jpeg"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex gap-10 mt-6">
                  <figure className="-my-6">
                    <img className="h-32" src={shopImage} alt="Preview" />
                    <figcaption className="text-sm italic">
                      Current Shop Image
                    </figcaption>
                  </figure>
                  {previewURL && (
                    <figure className="-my-6">
                      <img
                        className="h-32 "
                        src={previewURL}
                        alt="Updated Preview"
                      />
                      <figcaption className="text-sm italic">
                        Updated Shop Image
                      </figcaption>
                    </figure>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <label
                    for="district"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Shop Location District
                  </label>
                  <select
                    name="district"
                    required={true}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    class="bg-white border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="" selected="">
                      All district
                    </option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Jessore">Jessore</option>
                  </select>
                </div>
                <div>
                  <label
                    for="city"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Shop Location City
                  </label>
                  <select
                    required={true}
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    class="bg-white border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="" selected="">
                      All city
                    </option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Jessore">Jessore</option>
                  </select>
                </div>
                <div>
                  <label
                    for="area"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Shop Location Area
                  </label>
                  <select
                    required={true}
                    name="area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    class="bg-white border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="" selected="">
                      All area
                    </option>

                    <option value="Gulshan">Gulshan</option>
                    <option value="Uttara">Uttara</option>
                    <option value="Agrabad">Agrabad</option>
                    <option value="Banani">Banani</option>
                    <option value="Boalia">Boalia</option>
                    <option value="Sadar">Sadar</option>
                    <option value="Road">Road</option>
                    <option value="Mohammadpur">Mohammadpur</option>
                    <option value="Zindabazar">Zindabazar</option>
                    <option value="Mirpur">Mirpur</option>
                    <option value="New Market">New Market</option>
                  </select>
                </div>
                <div>
                  <label
                    for="activeHour"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Shop Active Hour
                  </label>
                  <select
                    required={true}
                    name="activeHour"
                    value={activeHour}
                    onChange={(e) => setActiveHour(e.target.value)}
                    class="bg-white border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Active hour</option>
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                    <option value="Day-Night">Day-Night</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className="col-span-1">
            <InstructionCardShopOwner />
          </div>
        </div>
      </div>
    </div>
  );
}
