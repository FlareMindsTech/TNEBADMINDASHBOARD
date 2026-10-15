import React, { useState, useEffect, useRef } from "react";
import {
  Flex,
  Box,
  useToast,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import {
  FaAward,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaLayerGroup,
  FaThList,
  FaColumns,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaSync,
  FaTrash,
  FaExternalLinkAlt,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";
import {
  getAllMinnagams,
  updateMinnagamStatus,
  deleteMinnagam,
  getUserProfile,
  showErrorToast,
} from "views/utils/axiosInstance";
import MinnagamCertificateModal from "./MinnagamCertificateModal";
import "./Minnagam.css";

// ==========================================================================
// PAGINATED SUBMISSIONS TABLE COMPONENT
// ==========================================================================
const PaginatedSubmissionsTable = ({
  subList = [],
  emptyMsg,
  itemsPerPage = 10,
  setSelectedCertData,
  setShowCertModal,
  onViewDoc,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = subList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalItems, totalPages, currentPage]);

  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedItems = subList.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safePage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (safePage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", safePage - 1, safePage, safePage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return "N/A";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return String(dateVal);
    }
  };

  return (
    <div className="submissions-table-card">
      <div className="table-responsive">
        <table className="submissions-table">
          <thead>
            <tr>
              <th className="col-date">Date</th>
              <th className="col-member">Member Name</th>
              <th className="col-nominee">Nominee</th>
              <th className="col-relation">Relation</th>
              <th className="col-units">Units</th>
              <th className="col-amount">Amount</th>
              <th className="col-utr">UTR Number</th>
              <th className="col-doc">Document</th>
              <th className="col-status">Status</th>
              <th className="col-cert">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {subList.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">
                  {emptyMsg || "No submissions found."}
                </td>
              </tr>
            ) : (
              paginatedItems.map((sub) => {
                const userName =
                  sub.user?.name ||
                  (typeof sub.user === "string" ? "Member" : "N/A");
                const userEmp =
                  sub.user?.emp_id || sub.user?.pbo_number || sub.user?.lm_number;
                const userPhone = sub.user?.phone_no;
                const subDetails = [userEmp, userPhone].filter(Boolean).join(" • ");

                return (
                  <tr key={sub._id}>
                    {/* 1. Date */}
                    <td className="col-date">{formatDate(sub.createdAt)}</td>

                    {/* 2. Member Name */}
                    <td className="col-member">
                      <div className="member-name-text">{userName}</div>
                      {subDetails && (
                        <div className="member-sub-text">{subDetails}</div>
                      )}
                    </td>

                    {/* 3. Nominee */}
                    <td className="col-nominee">{sub.nomineeName || "N/A"}</td>

                    {/* 4. Relation */}
                    <td className="col-relation">{sub.relation || "N/A"}</td>

                    {/* 5. Units */}
                    <td className="col-units">{sub.units}</td>

                    {/* 6. Amount */}
                    <td className="col-amount">
                      ₹{sub.amount ? Number(sub.amount).toLocaleString() : "0"}
                    </td>

                    {/* 7. UTR Number */}
                    <td className="col-utr">{sub.utrNumber || "N/A"}</td>

                    {/* 8. Document */}
                    <td className="col-doc">
                      {sub.document?.url ? (
                        <a
                          href={sub.document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doc-link"
                          onClick={(e) => {
                            if (onViewDoc) {
                              e.preventDefault();
                              onViewDoc(sub.document.url);
                            }
                          }}
                        >
                          View
                        </a>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>—</span>
                      )}
                    </td>

                    {/* 9. Status Badge */}
                    <td className="col-status">
                      <span
                        className={`status-badge status-${(
                          sub.status || "pending"
                        ).toLowerCase()}`}
                      >
                        {sub.status || "Pending"}
                      </span>
                    </td>

                    {/* 10. Certificate Button */}
                    <td className="col-cert">
                      <button
                        type="button"
                        className="btn-view-cert"
                        onClick={() => {
                          setSelectedCertData(sub);
                          setShowCertModal(true);
                        }}
                        title="View & Download Certificate"
                      >
                        <FaAward className="cert-icon" /> Certificate
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="table-pagination-footer">
          <div className="pagination-info">
            Showing <span className="pagination-highlight">{startIndex + 1}</span> to{" "}
            <span className="pagination-highlight">{endIndex}</span> of{" "}
            <span className="pagination-highlight">{totalItems}</span> submissions
            <span className="pagination-per-page">(10 per page)</span>
          </div>

          <div className="pagination-controls">
            <button
              type="button"
              className="pagination-nav-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={safePage <= 1}
              title="Previous Page"
            >
              <FaChevronLeft className="page-nav-icon" />
              <span>Prev</span>
            </button>

            <div className="pagination-numbers">
              {getPageNumbers().map((p, idx) => {
                if (p === "...") {
                  return (
                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                      &hellip;
                    </span>
                  );
                }
                return (
                  <button
                    key={p}
                    type="button"
                    className={`pagination-num-btn ${
                      safePage === p ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(p)}
                    disabled={totalPages <= 1}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="pagination-nav-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={safePage >= totalPages}
              title="Next Page"
            >
              <span>Next</span>
              <FaChevronRight className="page-nav-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================================================
// MAIN MINNAGAM COMPONENT FOR TNEBEA ADMIN DASHBOARD
// ==========================================================================
function Minnagam() {
  const toast = useToast();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'approved', 'rejected', 'pending'
  const [viewMode, setViewMode] = useState("tabs"); // 'tabs' or 'split'
  const [searchQuery, setSearchQuery] = useState("");

  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false);
  const [selectedCertData, setSelectedCertData] = useState(null);

  // Document Viewer Modal State
  const [previewDocUrl, setPreviewDocUrl] = useState(null);

  // Delete Confirmation Alert Dialog State
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const cancelRef = useRef();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getAllMinnagams();
      const rawList = Array.isArray(data) ? data : [];

      // Resolve registered member details for each submission if not fully populated
      const populatedList = await Promise.all(
        rawList.map(async (sub) => {
          if (
            sub.user &&
            typeof sub.user === "object" &&
            (sub.user.name || sub.user.phone_no)
          ) {
            return sub;
          }
          const targetUid =
            typeof sub.user === "string" ? sub.user : sub.user?._id;
          if (targetUid) {
            try {
              const uProfile = await getUserProfile(targetUid);
              if (uProfile) {
                return { ...sub, user: uProfile };
              }
            } catch (uErr) {
              console.warn(
                `Could not resolve user for submission ${sub._id}:`,
                uErr
              );
            }
          }
          return sub;
        })
      );

      setSubmissions(populatedList);
    } catch (err) {
      console.error("Failed to load Minnagam submissions:", err);
      showErrorToast(toast, err, "Failed to load Minnagam submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      await updateMinnagamStatus(id, status);
      toast({
        title: "Status Updated",
        description: `Submission marked as ${status}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchSubmissions();
    } catch (err) {
      console.error(err);
      showErrorToast(toast, err, "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const promptDelete = (id) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    setIsAlertOpen(false);
    if (!deleteId) return;
    setActionLoading(deleteId);
    try {
      await deleteMinnagam(deleteId);
      toast({
        title: "Submission Deleted",
        description: "Successfully removed Minnagam record.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchSubmissions();
    } catch (err) {
      showErrorToast(toast, err, "Failed to delete submission");
    } finally {
      setActionLoading(null);
      setDeleteId(null);
    }
  };

  // Search filter
  const filteredSubmissions = submissions.filter((sub) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const uName = (sub.user?.name || "").toLowerCase();
    const uEmp = (
      sub.user?.emp_id ||
      sub.user?.pbo_number ||
      sub.user?.lm_number ||
      ""
    ).toLowerCase();
    const uPhone = (sub.user?.phone_no || "").toLowerCase();
    const nominee = (sub.nomineeName || "").toLowerCase();
    const rel = (sub.relation || "").toLowerCase();
    const utr = (sub.utrNumber || "").toLowerCase();
    const st = (sub.status || "").toLowerCase();

    return (
      uName.includes(q) ||
      uEmp.includes(q) ||
      uPhone.includes(q) ||
      nominee.includes(q) ||
      rel.includes(q) ||
      utr.includes(q) ||
      st.includes(q)
    );
  });

  const pendingSubmissions = filteredSubmissions.filter(
    (s) => (s.status || "").toLowerCase() === "pending"
  );
  const approvedSubmissions = filteredSubmissions.filter(
    (s) => (s.status || "").toLowerCase() === "approved"
  );
  const rejectedSubmissions = filteredSubmissions.filter(
    (s) => (s.status || "").toLowerCase() === "rejected"
  );

  const getActiveTabList = () => {
    switch (statusFilter) {
      case "approved":
        return approvedSubmissions;
      case "pending":
        return pendingSubmissions;
      case "rejected":
        return rejectedSubmissions;
      default:
        return filteredSubmissions;
    }
  };

  const totalCount = submissions.length;
  const pendingCount = submissions.filter(
    (s) => (s.status || "").toLowerCase() === "pending"
  ).length;
  const approvedCount = submissions.filter(
    (s) => (s.status || "").toLowerCase() === "approved"
  ).length;
  const rejectedCount = submissions.filter(
    (s) => (s.status || "").toLowerCase() === "rejected"
  ).length;

  const getStatusTitle = () => {
    switch (statusFilter) {
      case "approved":
        return "Approved Minnagam Submissions";
      case "pending":
        return "Pending Minnagam Submissions";
      case "rejected":
        return "Rejected Minnagam Submissions";
      default:
        return "All Minnagam Submissions";
    }
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <div className="minnagam-admin-container">
        {/* Top Control Card */}
        <div className="minnagam-header-card">
          <div className="minnagam-header-top">
            <div className="minnagam-title-area">
              <FaAward className="minnagam-title-icon" />
              <div>
                <h1 className="minnagam-page-title">Minnagam Submissions</h1>
                <p className="minnagam-subtitle">
                  Manage member contributions, approvals, payment verifications &
                  official certificates
                </p>
              </div>
            </div>

            <Button
              leftIcon={<FaSync />}
              colorScheme="blue"
              variant="outline"
              size="sm"
              isLoading={loading}
              onClick={fetchSubmissions}
            >
              Refresh Data
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="minnagam-stats-grid">
            <div
              className={`minnagam-stat-pill ${
                statusFilter === "all" ? "active" : ""
              }`}
              onClick={() => {
                setStatusFilter("all");
                setViewMode("tabs");
              }}
            >
              <div className="stat-pill-icon all">
                <FaLayerGroup />
              </div>
              <div className="stat-pill-info">
                <span className="stat-pill-label">Total Submissions</span>
                <span className="stat-pill-number">{totalCount}</span>
              </div>
            </div>

            <div
              className={`minnagam-stat-pill ${
                statusFilter === "approved" ? "active" : ""
              }`}
              onClick={() => {
                setStatusFilter("approved");
                setViewMode("tabs");
              }}
            >
              <div className="stat-pill-icon approved">
                <FaCheckCircle />
              </div>
              <div className="stat-pill-info">
                <span className="stat-pill-label">Approved</span>
                <span className="stat-pill-number">{approvedCount}</span>
              </div>
            </div>

            <div
              className={`minnagam-stat-pill ${
                statusFilter === "pending" ? "active" : ""
              }`}
              onClick={() => {
                setStatusFilter("pending");
                setViewMode("tabs");
              }}
            >
              <div className="stat-pill-icon pending">
                <FaClock />
              </div>
              <div className="stat-pill-info">
                <span className="stat-pill-label">Pending Review</span>
                <span className="stat-pill-number">{pendingCount}</span>
              </div>
            </div>

            <div
              className={`minnagam-stat-pill ${
                statusFilter === "rejected" ? "active" : ""
              }`}
              onClick={() => {
                setStatusFilter("rejected");
                setViewMode("tabs");
              }}
            >
              <div className="stat-pill-icon rejected">
                <FaTimesCircle />
              </div>
              <div className="stat-pill-info">
                <span className="stat-pill-label">Rejected</span>
                <span className="stat-pill-number">{rejectedCount}</span>
              </div>
            </div>
          </div>

          {/* Toolbar with Filter Tabs, View Switcher & Search Input */}
          <div className="minnagam-toolbar">
            {viewMode === "tabs" && (
              <div className="status-filter-bar">
                <button
                  type="button"
                  className={`status-filter-btn ${
                    statusFilter === "all" ? "active" : ""
                  }`}
                  onClick={() => setStatusFilter("all")}
                >
                  <FaLayerGroup className="filter-btn-icon" />
                  <span>All</span>
                  <span className="filter-count-badge">{totalCount}</span>
                </button>

                <button
                  type="button"
                  className={`status-filter-btn ${
                    statusFilter === "approved" ? "active" : ""
                  }`}
                  onClick={() => setStatusFilter("approved")}
                >
                  <FaCheckCircle className="filter-btn-icon text-green" />
                  <span>Approved</span>
                  <span className="filter-count-badge">{approvedCount}</span>
                </button>

                <button
                  type="button"
                  className={`status-filter-btn ${
                    statusFilter === "pending" ? "active" : ""
                  }`}
                  onClick={() => setStatusFilter("pending")}
                >
                  <FaClock className="filter-btn-icon text-amber" />
                  <span>Pending</span>
                  <span className="filter-count-badge">{pendingCount}</span>
                </button>

                <button
                  type="button"
                  className={`status-filter-btn ${
                    statusFilter === "rejected" ? "active" : ""
                  }`}
                  onClick={() => setStatusFilter("rejected")}
                >
                  <FaTimesCircle className="filter-btn-icon text-red" />
                  <span>Rejected</span>
                  <span className="filter-count-badge">{rejectedCount}</span>
                </button>
              </div>
            )}

            {/* Search Input */}
            <div className="search-box-wrapper">
              <FaSearch className="search-icon-inside" />
              <input
                type="text"
                className="search-box-input"
                placeholder="Search member, nominee, UTR, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* View Mode Toggle: Tabs vs All Tables Stacked */}
            <div className="view-mode-toggle">
              <button
                type="button"
                className={`view-mode-btn ${viewMode === "tabs" ? "active" : ""}`}
                onClick={() => setViewMode("tabs")}
                title="Single table with status tab navigation"
              >
                <FaThList /> Tabs View
              </button>
              <button
                type="button"
                className={`view-mode-btn ${viewMode === "split" ? "active" : ""}`}
                onClick={() => setViewMode("split")}
                title="All tables stacked on one screen"
              >
                <FaColumns /> All Tables
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading && submissions.length === 0 ? (
          <Flex justify="center" align="center" minHeight="250px">
            <Spinner size="xl" color="#0A3D91" thickness="4px" />
          </Flex>
        ) : viewMode === "split" ? (
          /* Split View: All Tables Stacked */
          <div className="split-tables-wrapper">
            {/* 1. Pending Section */}
            <div className="split-table-section">
              <div className="split-section-header header-pending">
                <h3 className="split-section-title">
                  <FaClock className="text-amber" />
                  <span>Pending Review</span>
                </h3>
                <span className="split-count-pill pill-pending">
                  {pendingSubmissions.length} Pending
                </span>
              </div>
              <PaginatedSubmissionsTable
                subList={pendingSubmissions}
                emptyMsg="No pending submissions to review."
                itemsPerPage={10}
                setSelectedCertData={setSelectedCertData}
                setShowCertModal={setShowCertModal}
                onViewDoc={setPreviewDocUrl}
              />
            </div>

            {/* 2. Approved Section */}
            <div className="split-table-section">
              <div className="split-section-header header-approved">
                <h3 className="split-section-title">
                  <FaCheckCircle className="text-green" />
                  <span>Approved Submissions</span>
                </h3>
                <span className="split-count-pill pill-approved">
                  {approvedSubmissions.length} Approved
                </span>
              </div>
              <PaginatedSubmissionsTable
                subList={approvedSubmissions}
                emptyMsg="No approved submissions found."
                itemsPerPage={10}
                setSelectedCertData={setSelectedCertData}
                setShowCertModal={setShowCertModal}
                onViewDoc={setPreviewDocUrl}
              />
            </div>

            {/* 3. Rejected Section */}
            <div className="split-table-section">
              <div className="split-section-header header-rejected">
                <h3 className="split-section-title">
                  <FaTimesCircle className="text-red" />
                  <span>Rejected Submissions</span>
                </h3>
                <span className="split-count-pill pill-rejected">
                  {rejectedSubmissions.length} Rejected
                </span>
              </div>
              <PaginatedSubmissionsTable
                subList={rejectedSubmissions}
                emptyMsg="No rejected submissions found."
                itemsPerPage={10}
                setSelectedCertData={setSelectedCertData}
                setShowCertModal={setShowCertModal}
                onViewDoc={setPreviewDocUrl}
              />
            </div>
          </div>
        ) : (
          /* Single Tabbed View (Matches Screenshot) */
          <div>
            <PaginatedSubmissionsTable
              subList={getActiveTabList()}
              emptyMsg={`No submissions found for filter: ${statusFilter}`}
              itemsPerPage={10}
              setSelectedCertData={setSelectedCertData}
              setShowCertModal={setShowCertModal}
              onViewDoc={setPreviewDocUrl}
            />
          </div>
        )}

        {/* Certificate Modal */}
        <MinnagamCertificateModal
          show={showCertModal}
          onClose={() => {
            setShowCertModal(false);
            setSelectedCertData(null);
          }}
          submissionData={selectedCertData}
        />

        {/* Document Preview Modal */}
        {previewDocUrl && (
          <div
            className="doc-modal-overlay"
            onClick={() => setPreviewDocUrl(null)}
          >
            <div
              className="doc-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="doc-modal-header">
                <h4>Payment Document Preview</h4>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <a
                    href={previewDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#ffffff", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" }}
                  >
                    <FaExternalLinkAlt /> Open in Tab
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreviewDocUrl(null)}
                    style={{ background: "none", border: "none", color: "#ffffff", fontSize: "18px", cursor: "pointer" }}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
              <div className="doc-modal-body">
                {previewDocUrl.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={previewDocUrl}
                    title="Document PDF Preview"
                    className="doc-preview-iframe"
                  />
                ) : (
                  <img
                    src={previewDocUrl}
                    alt="Payment Document"
                    className="doc-preview-img"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog
          isOpen={isAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsAlertOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Minnagam Entry
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete this contribution submission? This
                action cannot be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>
    </Flex>
  );
}

export default Minnagam;
