import React, { useState } from "react";
import "../Khim/MainPost.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as rtdbRef, push, update } from "firebase/database";
import "./PostPic.css";
import logo from "../KK/assets/logo.png";
import home from "../KK/assets/home.png";
import postpicimage from "../KK/assets/postpicimage.png";
import { Link } from "react-router-dom";

const PostPic = ({ user }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const storage = getStorage(); 
  const db = getDatabase(); 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handlePostSubmit = async () => {
    if (!file) {
      return;
    }

    
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);

    
    const downloadURL = await getDownloadURL(storageRef);

    
    const newPost = {
      user: user.displayName,
      content: caption,
      mediaURL: downloadURL,
      timestamp: new Date().toLocaleString(),
    };

    
    const postsRef = rtdbRef(db, "posts");
    const newPostRef = push(postsRef); 
    update(newPostRef, newPost); 

    
    setFile(null);
    setCaption("");
  };


  return (
    <div className="PostPicContainer">
      <div className="PostPicCookie"></div>
      <Link to="/MainPost">
        <div className="PostPicLogoBox"></div>
        <div className="PostPictHomeBox"></div>
        <img className="PostPicLogo" src={logo}></img>
        <p class="BiskketText">BISKKET</p>
      </Link>

      <Link to="/MainPost">
        <img className="PostPicHome" src={home}></img>
        <p class="HomeText">HOME</p>
      </Link>

      <div className="PostPicWhiteBox"></div>
      <p className="PostPicText">Post Picture</p>

      <div className="post-img-box">
        {file ? (
          <img src={URL.createObjectURL(file)} alt="Image Preview" />
        ) : (
          <img src={postpicimage} />
        )}
        <textarea
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <Link to="/MainPost">
          <button onClick={handlePostSubmit}>Post</button>
        </Link>
      </div>
    </div>
  );
};

export default PostPic;
