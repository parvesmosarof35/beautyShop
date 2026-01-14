
// export const imgUrl = "https://ecommarce-backend-dsoe.onrender.com/";
export const imgUrl = `${process.env.NEXT_PUBLIC_IMG_URL}`;


export const url = `${imgUrl}api/v1/`;

//console.log(url);


// Email: parvesmosarof32@gmail.com
// Password: 12345678
export const guestUser = {
  email: `${process.env.NEXT_PUBLIC_GUEST_USER_EMAIL}`,
  password: `${process.env.NEXT_PUBLIC_GUEST_USER_PASSWORD}`
};

console.log(guestUser, imgUrl, "asdf");

// new comment

// 🔥 WebSocket base URL (auto picks wss:// if https page, ws:// otherwise)
// const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
// export const wsUrl = `${wsProtocol}://${new URL(imgUrl).host}`;

// Function to get the base API URL
export const getBaseUrl = () => url;

// Function to get the image base URL
export const getImageBaseUrl = () => imgUrl;

// Function to get the WebSocket base URL
// export const getWsBaseUrl = () => wsUrl;

// asdf 

export const getImageUrl = (imagePath : any) => {
  if (!imagePath) return "";

  // If it's already a full URL, return as-is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Remove trailing slash from base and leading slash from path
  const base = imgUrl.replace(/\/+$/, "");
  const path = imagePath.replace(/^\/+/, "");

  const finalUrl = `${base}/${path}`;
  // console.log("Image URL:", finalUrl);

  return finalUrl;
};
