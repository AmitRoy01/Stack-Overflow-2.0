import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function PostList({ token }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [fileExtension, setFileExtension] = useState("c");
  const [showingUserPosts, setShowingUserPosts] = useState(false); // State to toggle view
  const [codeSnippets, setCodeSnippets] = useState({});
  const [showCreatePost, setShowCreatePost] = useState(false); // State to toggle create post form

  useEffect(() => {
    fetchPosts(); // Initially fetch posts by others
  }, [token]);

  const fetchPosts = async () => {
    const res = await fetch(`http://localhost/post`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPosts(data);
    setShowingUserPosts(false); // Set to false when fetching posts by others
  };

  const fetchUserPosts = async () => {
    const res = await fetch(`http://localhost/post/mypost`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPosts(data);
    setShowingUserPosts(true); // Set to true when fetching user posts
  };

  const fetchCodeSnippet = async (url, postId) => {
    try {
      const res = await fetch(url);

      console.log('Fetching code snippet from URL:', url); // Log the URL

      const content = await res.text();
      setCodeSnippets((prev) => ({ ...prev, [postId]: content })); // Store the content in state
    } catch (error) {
      console.error("Error fetching code snippet:", error);
    }
  };

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("fileExtension", fileExtension);
    if (content) {
      formData.append("content", content);
    }

    if (file) {
      formData.append("codeSnippet", file);
    }

    const res = await fetch(`http://localhost/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      setFile(null);
      alert("Post created successfully");
      fetchPosts(); // Refresh posts after creating a new post
    } else {
      alert("Error creating post");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Posts</h2>
        <div className="flex space-x-4">
          <button
            onClick={fetchUserPosts}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            View My Posts
          </button>
          <button
            onClick={fetchPosts}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            View Other Posts
          </button>
          <button
            onClick={() => setShowCreatePost(!showCreatePost)}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-300"
          >
            {showCreatePost ? "Hide Create Post" : "Create a Post"}
          </button>
        </div>
      </div>

      {showCreatePost && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a Post</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={fileExtension}
            onChange={(e) => setFileExtension(e.target.value)}
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="py">Python</option>
            <option value="js">JavaScript</option>
            <option value="ts">TypeScript</option>
            <option value="rb">Ruby</option>
            <option value="php">PHP</option>
            <option value="cs">C#</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreatePost}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg mb-6 transition duration-300"
          >
            Create Post
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {showingUserPosts ? "My Posts" : "Other Posts"}
      </h2>
      {posts.length ? (
        posts.map((post) => (
          <div key={post._id} className="p-6 mb-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>

            {post.codeSnippetUrl && (
              <>
                <button
                  onClick={() =>
                    codeSnippets[post._id]
                      ? setCodeSnippets((prev) => ({ ...prev, [post._id]: null }))
                      : fetchCodeSnippet(post.codeSnippetUrl, post._id)
                  }
                  className="text-blue-600 hover:underline mb-2"
                >
                  {codeSnippets[post._id] ? "Hide Code Snippet" : "Load Code Snippet"}
                </button>
                {codeSnippets[post._id] && (
                  <pre className="bg-gray-100 p-4 rounded-lg">
                    <code>{codeSnippets[post._id]}</code>
                  </pre>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-600">No posts available.</p>
      )}
    </div>
  );
}

PostList.propTypes = {
  token: PropTypes.string.isRequired,
};

export default PostList;
