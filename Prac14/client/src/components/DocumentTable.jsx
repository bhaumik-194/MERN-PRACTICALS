
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Download,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { formatDate, formatFileSize } from "../utils/formatters";

export default function DocumentTable({
  documents,
  onDownload,
  onRename,
  onDelete,
}) {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [renameError, setRenameError] = useState("");
  const [renaming, setRenaming] = useState(false);

  const menuRef = useRef(null);
  const triggerRefs = useRef(new Map());

  useEffect(() => {
    if (openMenuId === null) return;

    const updatePosition = () => {
      const trigger = triggerRefs.current.get(openMenuId);
      const menu = menuRef.current;

      if (!trigger || !menu) return;

      const rect = trigger.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const padding = 12;
      const gap = 8;

      const left = Math.max(
        padding,
        Math.min(
          rect.right - menuRect.width,
          window.innerWidth - menuRect.width - padding
        )
      );

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openAbove =
        spaceBelow < menuRect.height + gap &&
        spaceAbove > spaceBelow;

      const top = openAbove
        ? Math.max(padding, rect.top - menuRect.height - gap)
        : Math.min(
            window.innerHeight - menuRect.height - padding,
            rect.bottom + gap
          );

      setMenuPosition({ left, top });
    };

    const frame = requestAnimationFrame(updatePosition);

    const handleOutsideClick = (event) => {
      const trigger = triggerRefs.current.get(openMenuId);

      if (
        !menuRef.current?.contains(event.target) &&
        !trigger?.contains(event.target)
      ) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [openMenuId]);

  async function saveRename(document) {
    const trimmedName = newName.trim();

    if (!trimmedName || renaming) return;

    setRenameError("");

    try {
      setRenaming(true);
      await onRename(document, trimmedName);
      setEditingId(null);
      setNewName("");
    } catch (error) {
      setRenameError(
        error.response?.data?.message || "Unable to rename this document."
      );
    } finally {
      setRenaming(false);
    }
  }

  function toggleMenu(id) {
    if (openMenuId === id) {
      setOpenMenuId(null);
      setMenuPosition(null);
    } else {
      setMenuPosition(null);
      setOpenMenuId(id);
    }
  }

  if (!documents.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <FileText size={28} />
        </div>
        <h3>No documents found</h3>
        <p>Try a different search or upload a new document.</p>
      </div>
    );
  }

  const activeDocument = documents.find(
    (document) => (document._id ?? document.id) === openMenuId
  );

  return (
    <div className="documents-table-wrapper">
      <table className="documents-table">
        <thead>
          <tr>
            <th>Document name</th>
            <th>File size</th>
            <th>Date added</th>
            <th className="actions-heading">Actions</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((document) => {
            const id = document._id ?? document.id;
            const name =
              document.originalName ??
              document.name ??
              document.filename ??
              "Untitled document";

            return (
              <tr key={id}>
                <td>
                  <div className="document-name-cell">
                    <span className="file-type-icon">
                      <FileText size={19} />
                    </span>

                    {editingId === id ? (
                      <form
                        className="rename-form"
                        onSubmit={(event) => {
                          event.preventDefault();
                          saveRename(document);
                        }}
                      >
                        <input
                          value={newName}
                          onChange={(event) => setNewName(event.target.value)}
                          aria-label="New document name"
                          autoFocus
                          maxLength={255}
                          required
                          disabled={renaming}
                        />
                        <button
                          type="submit"
                          className="text-button"
                          disabled={renaming}
                        >
                          {renaming ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          className="text-button"
                          disabled={renaming}
                          onClick={() => {
                            setEditingId(null);
                            setRenameError("");
                          }}
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <span className="document-name-text">{name}</span>
                    )}
                  </div>
                  {editingId === id && renameError && (
                    <p className="rename-error" role="alert">
                      {renameError}
                    </p>
                  )}
                </td>

                <td>{formatFileSize(document.size ?? 0)}</td>
                <td>
                  {formatDate(document.createdAt ?? document.uploadedAt)}
                </td>

                <td>
                  <div className="document-actions">
                    <button
                      type="button"
                      className="icon-button"
                      title="Download document"
                      aria-label={`Download ${name}`}
                      onClick={() => onDownload(document)}
                    >
                      <Download size={17} />
                    </button>

                    <button
                      type="button"
                      className="icon-button"
                      title="Rename document"
                      aria-label={`Rename ${name}`}
                      onClick={() => {
                        setEditingId(id);
                        setNewName(name);
                        setRenameError("");
                        setOpenMenuId(null);
                        setMenuPosition(null);
                      }}
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      ref={(element) => {
                        if (element) triggerRefs.current.set(id, element);
                        else triggerRefs.current.delete(id);
                      }}
                      type="button"
                      className="icon-button"
                      title="More actions"
                      aria-label={`More actions for ${name}`}
                      aria-expanded={openMenuId === id}
                      onClick={() => toggleMenu(id)}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {openMenuId !== null &&
        createPortal(
          <div
            ref={menuRef}
            className="document-menu-popover"
            style={{
              position: "fixed",
              left: menuPosition?.left ?? 0,
              top: menuPosition?.top ?? 0,
              zIndex: 10000,
              visibility: menuPosition ? "visible" : "hidden",
            }}
          >
            {activeDocument && (
              <button
                type="button"
                className="delete-action"
                onClick={() => {
                  const document = activeDocument;
                  setOpenMenuId(null);
                  setMenuPosition(null);
                  onDelete(document);
                }}
              >
                <Trash2 size={16} />
                Delete document
              </button>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
