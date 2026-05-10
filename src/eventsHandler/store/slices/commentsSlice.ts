import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientService } from "../../services/EventHandler/clientService";
import { CommentsState, Comment, CreateCommentRequest } from "../../types";

const initialState: CommentsState = {
  comments: {},
  loading: false,
  error: null,
};

// Async thunks
export const getEventComments = createAsyncThunk(
  "comments/getEventComments",
  async (eventId: number, { rejectWithValue }) => {
    try {
      return await clientService.getEventComments(eventId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch comments",
      );
    }
  },
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (
    {
      eventId,
      userId,
      data,
    }: { eventId: number; userId: string; data: CreateCommentRequest },
    { rejectWithValue },
  ) => {
    try {
      return await clientService.createComment(eventId, userId, data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create comment",
      );
    }
  },
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (
    { commentId, eventId }: { commentId: number; eventId: number },
    { rejectWithValue },
  ) => {
    try {
      await clientService.deleteComment(commentId);
      return { commentId, eventId };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete comment",
      );
    }
  },
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearCommentsError: (state) => {
      state.error = null;
    },
    resetComments: (state) => {
      state.comments = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get event comments
      .addCase(getEventComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getEventComments.fulfilled,
        (state, action: PayloadAction<Comment[]>) => {
          state.loading = false;
          // Assuming the eventId is passed as meta, we'll need to get it from the action
          // For now, we'll use a convention where the first comment contains the eventId
          if (action.payload.length > 0) {
            state.comments[action.payload[0].eventId] = action.payload;
          }
        },
      )
      .addCase(getEventComments.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch comments";
      })
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          state.loading = false;
          const eventId = action.payload.eventId;
          if (!state.comments[eventId]) {
            state.comments[eventId] = [];
          }
          state.comments[eventId].push(action.payload);
        },
      )
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create comment";
      })
      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteComment.fulfilled,
        (
          state,
          action: PayloadAction<{ commentId: number; eventId: number }>,
        ) => {
          state.loading = false;
          const { commentId, eventId } = action.payload;
          if (state.comments[eventId]) {
            state.comments[eventId] = state.comments[eventId].filter(
              (c) => c.id !== commentId,
            );
          }
        },
      )
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete comment";
      });
  },
});

export const { clearCommentsError, resetComments } = commentsSlice.actions;

// Selectors
export const selectCommentsByEventId =
  (eventId: number) => (state: { comments: CommentsState }) =>
    state.comments.comments[eventId] || [];
export const selectCommentsLoading = (state: { comments: CommentsState }) =>
  state.comments.loading;
export const selectCommentsError = (state: { comments: CommentsState }) =>
  state.comments.error;

export default commentsSlice.reducer;
