
import { useCallback, useEffect, useState } from "react";
import documentService from "../services/documentService";

export default function useDocuments(initialParams = {}) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadDocuments() {
      setLoading(true);
      setError("");

      try {
        const result = await documentService.getDocuments(initialParams);

        const items =
          result.documents ??
          result.data?.documents ??
          result.data ??
          [];

        if (active) {
          setDocuments(Array.isArray(items) ? items : []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Could not load documents. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDocuments();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  return { documents, setDocuments, loading, error, refresh };
}
