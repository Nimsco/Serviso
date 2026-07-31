const AdminCategoriesPanel = ({ categories, categoryForm, setCategoryForm, addCategory, deleteCategory }) => (
  <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
    <form onSubmit={addCategory} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
      <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">Add Service Category</h3>

      <div className="space-y-4 pt-2">
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Category Name</label>
          <input
            type="text"
            placeholder="Category name"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] text-sm transition"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Image URL (Optional)</label>
          <input
            type="url"
            placeholder="https://..."
            value={categoryForm.image}
            onChange={(e) => setCategoryForm((prev) => ({ ...prev, image: e.target.value }))}
            className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-3 rounded-xl focus:outline-none focus:border-[var(--primary)] text-sm transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Upload Category Icon File</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCategoryForm((prev) => ({ ...prev, imageFile: e.target.files[0] }))}
            className="w-full border border-[var(--border)] bg-[var(--input-bg)] text-[var(--text)] p-2 rounded-xl text-xs"
          />
        </div>

        <button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-3.5 rounded-xl font-bold tracking-wide transition duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-98">
          Create Category
        </button>
      </div>
    </form>

    <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-6">
      <h3 className="text-lg font-bold text-[var(--text)] tracking-tight">Active Service Categories</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category._id} className="border border-[var(--border)] rounded-xl p-4 flex items-center gap-4 bg-[var(--bg)]/40 hover:border-[var(--primary)]/20 transition">
            <img
              src={category.image || "/user.png"}
              alt={category.name}
              className="h-12 w-12 object-contain rounded-lg bg-[var(--bg-card)] p-1.5 border border-[var(--border)]"
              onError={(e) => {
                e.target.src = "https://img.icons8.com/color/96/maintenance.png";
              }}
            />
            <div className="flex-1 space-y-0.5">
              <h4 className="font-bold text-[var(--text)] leading-snug">{category.name}</h4>
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-500">
                {category.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => deleteCategory(category._id)}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold cursor-pointer transition shadow-xs"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AdminCategoriesPanel;
