<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api/api";

const router = useRouter();

const notes = ref([]);

const skip = ref(0);
const limit = 5;

const hasMore = ref(true);

const newNote = ref("");

const searchId = ref("");

const searchedNote = ref(null);

const editingId = ref(null);

const editContent = ref("");

const loadNotes = async () => {
  const res = await api.get(
    `/notes/allnotes?skip=${skip.value}&limit=${limit}`,
  );

  notes.value = res.data;

  hasMore.value = res.data.length === limit;
};

const createNote = async () => {
  if (!newNote.value.trim()) return;

  await api.post("/notes/create", {
    content: newNote.value,
  });

  newNote.value = "";

  skip.value = 0;

  loadNotes();
};

const findNote = async () => {
  if (!searchId.value) return;

  try {
    const res = await api.get(`/notes/${searchId.value}`);
    searchedNote.value = res.data;
  } catch {
    searchedNote.value = null;
    alert("Note not found");
  }
};

const startEdit = (note) => {
  editingId.value = note.id;
  editContent.value = note.description;
};

const saveEdit = async (id) => {
  await api.put(`/notes/update/${id}`, {
    content: editContent.value,
  });

  editingId.value = null;

  loadNotes();
};

const updateStatus = async (note) => {
  await api.put(`/notes/update/${note.id}`, {
    is_completed: !note.is_completed,
  });

  loadNotes();
};

const deleteNote = async (id) => {
  await api.delete(`/notes/delete/${id}`);

  if (skip.value > 0 && notes.value.length === 1) {
    skip.value -= limit;
  }

  loadNotes();
};

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};

onMounted(loadNotes);

const nextPage = async () => {
  skip.value += limit;
  await loadNotes();
};

const previousPage = async () => {
  if (skip.value >= limit) {
    skip.value -= limit;
    await loadNotes();
  }
};
</script>

<template>
  <div class="page">
    <div class="header">
      <h1>Notes</h1>

      <button class="logout-btn" @click="logout">Logout</button>
    </div>

    <div class="card create-card">
      <h3>Create Note</h3>

      <textarea v-model="newNote" placeholder="Write your note..." />

      <button @click="createNote">Add Note</button>
    </div>

    <div class="card search-card">
      <h3>Find Note By ID</h3>

      <input type="number" v-model="searchId" placeholder="Enter note id" />

      <button @click="findNote">Search</button>

      <div v-if="searchedNote" class="search-result">
        <strong>#{{ searchedNote.id }}</strong>

        <p>{{ searchedNote.description }}</p>
      </div>
    </div>

    <div class="notes-grid">
      <div class="note-card" v-for="note in notes" :key="note.id">
        <template v-if="editingId !== note.id">
          <div class="note-header">
            <input
              type="checkbox"
              :checked="note.is_completed"
              @change="updateStatus(note)"
            />

            <p class="note-text" :class="{ completed: note.is_completed }">
              {{ note.description }}
            </p>
          </div>

          <div class="actions">
            <button @click="startEdit(note)">Edit</button>

            <button class="delete-btn" @click="deleteNote(note.id)">
              Delete
            </button>
          </div>
        </template>

        <template v-else>
          <textarea v-model="editContent" />

          <div class="actions">
            <button @click="saveEdit(note.id)">Save</button>

            <button @click="editingId = null">Cancel</button>
          </div>
        </template>
      </div>
    </div>

    <div class="pagination">
      <button @click="previousPage" :disabled="skip === 0">Previous</button>

      <span> Page {{ Math.floor(skip / limit) + 1 }} </span>

      <button @click="nextPage" :disabled="!hasMore">Next</button>
    </div>
  </div>
</template>
