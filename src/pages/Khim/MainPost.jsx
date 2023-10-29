import React, { useEffect, useState } from "react";
import "./MainPost.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import biskketLogo from "./picture/mainLogo.png";
import iconPencil from "./picture/pencil.png";
import iconCamera from "./picture/camera.png";
import iconVideo from "./picture/video-camera.png";
import iconCookies from "./picture/cookies.png";
import demoPic from "./picture/gallery-2.png";
import userPic from "./picture/user.png";
import heartPic from "./picture/heart.png";
import { Link } from "react-router-dom";
import firebaseApp from "../../config";
import { getDatabase, ref, onValue, update } from "firebase/database";

const About = ({ user }) => {
  const [username, setUsername] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const db = getDatabase();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userUsername = user.displayName;
        setUsername(userUsername);
      } else {
        setUsername(null);
      }
    });

    const postsRef = ref(db, "posts");
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const postList = Object.entries(data).map(([key, post]) => ({
          key,
          ...post,
        }));
        setPosts(postList.reverse());
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLikePost = (post) => {
    const likeId = user.uid;
    const updatedPosts = [...posts];
    const postIndex = updatedPosts.findIndex((p) => p.key === post.key);

    if (postIndex !== -1) {
      if (!updatedPosts[postIndex].likes) {
        updatedPosts[postIndex].likes = {};
      }

      if (updatedPosts[postIndex].likes[likeId]) {
       
        delete updatedPosts[postIndex].likes[likeId];
      } else {
        
        updatedPosts[postIndex].likes[likeId] = true;
      }

      
      const postRef = ref(db, `posts/${post.key}`);
      update(postRef, { likes: updatedPosts[postIndex].likes });
    }
  };

  const handleAddComment = (post) => {
    if (commentText.trim() !== "") {
      const updatedPosts = [...posts];
      const postIndex = updatedPosts.findIndex((p) => p.key === post.key);

      if (postIndex !== -1) {
        if (!updatedPosts[postIndex].comments) {
          updatedPosts[postIndex].comments = [];
        }

        const newComment = {
          user: user.displayName,
          text: commentText,
        };
        updatedPosts[postIndex].comments.push(newComment);

        
        const postRef = ref(db, `posts/${post.key}`);
        update(postRef, { comments: updatedPosts[postIndex].comments });
      }
    }
  };

  return (
    <div className="mainPostContainer">
      <div className="mainToolBar">
        <div className="mainImg">.</div>
        <Link to="/">
          <div class="mainLogo">
            <img
              src={biskketLogo}
              alt="Biskket Logo"
              width="93px"
              height="88px"
            />
            <div className="mainTextPangolin"> BISKKET </div>
          </div>
        </Link>

        <Link to="/OwnProfile">
          <div class="mainButtonToProfile">
            <div className="mainTextVT323">Hi!</div>
            <div className="mainTextPangolinUsr">{username}</div>
          </div>
        </Link>

        <div className="mainArea">
          <div className="mainFeatureBar">
            <Link to="/CreatePost" style={{ textDecoration: "none" }}>
              <div className="mainButtonToNext">
                <img
                  src={iconPencil}
                  alt="Pencil Icon"
                  width="70px"
                  height="70px"
                />
                <div className="mainTextPangolin"> Write a post </div>
              </div>
            </Link>

            <Link to="/PostPic" style={{ textDecoration: "none" }}>
              <div className="mainButtonToNext">
                <img
                  src={iconCamera}
                  alt="Camera Icon"
                  width="70px"
                  height="70px"
                />
                <div className="mainTextPangolin"> Post Picture </div>
              </div>
            </Link>

            <div className="mainButtonToNext">
              <img
                src={iconVideo}
                alt="Video Icon"
                width="70px"
                height="70px"
              />
              <div className="mainTextPangolin"> Post Video </div>
            </div>

            <Link to="/FriendProfile" style={{ textDecoration: "none" }}>
              <div className="mainButtonToNext">
                <img
                  src={iconCookies}
                  alt="Cookie Icon"
                  width="70px"
                  height="70px"
                />
                <div className="mainTextPangolin"> Find Friends </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mainScrollArea">
          <div className="mainPostText">
            {posts.map((post, index) => (
              <div key={index} className="PostText">
                <div className="">
                  <div className="mainTextPangolinUser">{post.user}</div>
                  <div className="mainTextTimestamp">
                    Posted at: {post.timestamp}
                  </div>
                  <div className="mainContent">
                    <div className="polaroid">
                    
                      {post.mediaURL && (
                        <img src={post.mediaURL} alt="Posted Image" />
                      )}
                      <div className="mainTextPangolinCaption">
                         {post.content} 
                      </div>

                      <div className="mainLike">
                        <img src={heartPic} />
                        <div className="optionLike">
                          {post.likes ? Object.keys(post.likes).length : 0}
                          <button onClick={() => handleLikePost(post)}>
                            {post.likes && post.likes[username]
                              ? "Unlike"
                              : "Like"}
                          </button>
                        </div>
                      </div>

                     
                    </div>

                
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button onClick={() => handleAddComment(post)}>
                      Add Comment
                    </button>
                  
                    <div className="commentBox">
                      {post.comments &&
                        post.comments.map((comment, commentIndex) => (
                          <div key={commentIndex}>
                            <div className="mainTextPangolinUsr">
                              {comment.user}
                            </div>
                            <div className="commentText">{comment.text}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
