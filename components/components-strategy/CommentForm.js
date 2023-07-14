import React, { useContext } from 'react'
import { UserContext } from '../../pages/_app'

export default function CommentForm({ commentFormRef, commentInput, setCommentInput, handleCommentSubmit }) {
    const { profileData } = useContext(UserContext)

    if (!profileData?.data) {
        return (
        <textarea
            className="w-full p-2 border-2 border-black resize-none"
            maxLength="500"
            placeholder="Please log in to add a comment"
            style={{ minHeight: "50px" }}
            readOnly
        ></textarea>
        );
    }

  return (
    <form
    ref={commentFormRef}
    onSubmit={(e) => handleCommentSubmit(e)}
    className="flex flex-col mt-2 justify-end items-end"
    >
        <textarea
        name="commentInput"
        className="w-full p-2 border-2 border-black resize-none"
        maxLength="500"
        placeholder="write comment here..."
        required
        onChange={(e) => setCommentInput(e.target.value)}
        value={commentInput}
        style={{ minHeight: "50px" }}
        ></textarea>
        <span className="flex w-full my-2 justify-between">
        <label>
            <input 
            name='addSavedCharacter'
            type="checkbox"
            defaultValue={true}
            className='mr-2'
            ></input>
            include saved characters to post
        </label>
        <button type='submit' className="px-2 py-1 ml-2 border-2 border-black bg-orange-300 hover:bg-orange-400 z-[1000] relative">Submit Comment</button>
        </span>
    </form> 
  )
}
