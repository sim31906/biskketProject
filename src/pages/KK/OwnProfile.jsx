import React, { useEffect, useState } from "react";
import "./OwnProfile.css";
import logo from "../KK/assets/logo.png";
import home from "../KK/assets/home.png";
import userprofile from "../KK/assets/userprofile.png";
import like from "../KK/assets/like.png";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
  remove,
} from "firebase/database";

const OwnProfile = () => {
  const [username, setUsername] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userUsername = user.displayName;
        setUsername(userUsername);

        const postsRef = ref(db, "posts");
        const userPostsQuery = query(
          postsRef,
          orderByChild("user"),
          equalTo(userUsername)
        );
      
        onValue(userPostsQuery, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const userPostList = Object.entries(data).map(([key, value]) => ({
              key,
              ...value,
            }));

         
            const reversedUserPostList = userPostList.reverse();

            setUserPosts(reversedUserPostList);
          }
        });
      } else {
        setUsername(null);
        setUserPosts([]);
      }
    });

    return () => unsubscribe();
  }, [db]);

  const handleDeletePost = (postKey) => {
    const postRef = ref(db, `posts/${postKey}`);
    remove(postRef)
      .then(() => {
        
        setUserPosts((prevUserPosts) =>
          prevUserPosts.filter((post) => post.key !== postKey)
        );
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  return (
    <div className="OwnProfileContainer">
      <div className="OwnProfileCookie"></div>

      <Link to="/MainPost">
        <div className="OwnProfileLogoBox"></div>
        <div className="OwnProfileHomeBox"></div>
        <img className="OwnProfileLogo" src={logo}></img>
        <p class="BiskketText">BISKKET</p>
        <img className="OwnProfileHome" src={home}></img>
        <p class="HomeText">HOME</p>
      </Link>

      <div className="UserBox">
        <img className="UserImage" src={userprofile}></img>
        <div className="UserText">{username}</div>
      
        <div className="UserPosts"></div>
      </div>

      <div className="scrollArea">
        {userPosts.map((post, index) => (
          <div key={index} className="UserPost">
            <button
              className="deletePost"
              onClick={() => handleDeletePost(post.key)}
            >
              X
            </button>
            <div className="mainTextPangolinUser">{post.user}</div>
            {post.mediaURL && <img src={post.mediaURL} alt="Posted Image" />}
            <div className="UserPostCaption">{post.content}</div>
            <div className="UserPostTimestamp">Posted at: {post.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnProfile;
