import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
  Text,
  Spinner,
  Badge,
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tooltip,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Textarea,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import {
  FaEye,
  FaSync,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaPaperclip,
  FaSearch,
  FaFileAlt,
  FaClock,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  getAllGrievances,
  getGrievanceStats,
  verifyGrievance,
  deleteGrievance,
  showErrorToast,
} from "views/utils/axiosInstance";

function Grievances() {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.800");
  const customColor = "#0A3D91";
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
  });

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("ALL");

  // Detailed View Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [modalRemarks, setModalRemarks] = useState("");
  const [isSavingRemarks, setIsSavingRemarks] = useState(false);

  // Deletion Dialog state
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const cancelRef = useRef();

  useEffect(() => {
    fetchData();
    fetchStats();
  }, [verifiedFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllGrievances({
        search: searchTerm.trim() || undefined,
        isVerified: verifiedFilter !== "ALL" ? (verifiedFilter === "VERIFIED" ? "true" : "false") : undefined,
        limit: 100,
      });

      if (res && res.data) {
        setGrievances(res.data);
      } else if (Array.isArray(res)) {
        setGrievances(res);
      } else {
        setGrievances([]);
      }
    } catch (error) {
      console.error("Failed to load grievances:", error);
      showErrorToast(toast, error, "Failed to load grievances list.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getGrievanceStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (error) {
      console.warn("Could not fetch grievance stats:", error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Direct toggle verification for a grievance
  const handleToggleVerify = async (grievance) => {
    const newVerifyState = !grievance.isVerified;
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const adminName = storedUser.name || storedUser.username || "Admin";

      const res = await verifyGrievance(grievance._id, {
        isVerified: newVerifyState,
        verifiedByName: adminName,
        remarks: modalRemarks.trim() || (newVerifyState ? "Verified by CEC Admin" : "Verification revoked by Admin"),
      });

      toast({
        title: newVerifyState ? "Grievance Verified" : "Verification Revoked",
        description: res?.message || (newVerifyState ? "Grievance marked as verified." : "Grievance verification revoked."),
        status: newVerifyState ? "success" : "info",
        duration: 3000,
        isClosable: true,
      });

      // Update in local state
      setGrievances((prev) =>
        prev.map((item) =>
          item._id === grievance._id
            ? {
                ...item,
                isVerified: newVerifyState,
                verifiedAt: newVerifyState ? new Date() : null,
                verifiedByName: newVerifyState ? adminName : null,
              }
            : item
        )
      );

      // If open in modal, update modal state
      if (selectedGrievance && selectedGrievance._id === grievance._id) {
        setSelectedGrievance((prev) => ({
          ...prev,
          isVerified: newVerifyState,
          verifiedAt: newVerifyState ? new Date() : null,
          verifiedByName: newVerifyState ? adminName : null,
        }));
      }

      fetchStats();
    } catch (error) {
      showErrorToast(toast, error, "Failed to update verification status.");
    }
  };

  // Open Details Modal
  const openDetailsModal = (grievance) => {
    setSelectedGrievance(grievance);
    setModalRemarks(grievance.remarks || "");
    setIsModalOpen(true);
  };

  // Save Remarks from Modal
  const handleSaveRemarks = async () => {
    if (!selectedGrievance) return;
    setIsSavingRemarks(true);
    try {
      await verifyGrievance(selectedGrievance._id, {
        isVerified: selectedGrievance.isVerified,
        remarks: modalRemarks.trim(),
      });

      toast({
        title: "Remarks Saved",
        description: "Official remarks updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setGrievances((prev) =>
        prev.map((item) =>
          item._id === selectedGrievance._id
            ? { ...item, remarks: modalRemarks.trim() }
            : item
        )
      );

      setSelectedGrievance((prev) => ({
        ...prev,
        remarks: modalRemarks.trim(),
      }));
    } catch (error) {
      showErrorToast(toast, error, "Failed to save remarks.");
    } finally {
      setIsSavingRemarks(false);
    }
  };

  // Prompt Deletion
  const promptDelete = (id) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  // Confirm Deletion
  const confirmDelete = async () => {
    setIsAlertOpen(false);
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteGrievance(deleteId);
      toast({
        title: "Grievance Deleted",
        description: "Successfully removed grievance and cleaned up CDN storage.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchData();
      fetchStats();
      if (selectedGrievance?._id === deleteId) {
        setIsModalOpen(false);
      }
    } catch (error) {
      showErrorToast(toast, error, "Failed to delete grievance.");
      setLoading(false);
    }
  };

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }} minH="calc(100vh - 20px)">
      {/* ==================== 1. SUMMARY STATS CARDS ==================== */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4} mb={5}>
        <Card bg={cardBg} p={4} borderRadius="16px" boxShadow="sm">
          <Stat>
            <StatLabel fontSize="xs" color="gray.500" fontWeight="bold">TOTAL GRIEVANCES</StatLabel>
            <StatNumber fontSize="2xl" color={customColor} fontWeight="extrabold">
              {stats.total || 0}
            </StatNumber>
          </Stat>
        </Card>

        <Card bg={cardBg} p={4} borderRadius="16px" boxShadow="sm" borderLeft="4px solid #38a169">
          <Stat>
            <StatLabel fontSize="xs" color="green.600" fontWeight="bold">VERIFIED</StatLabel>
            <StatNumber fontSize="2xl" color="green.500" fontWeight="extrabold">
              {stats.verified || 0}
            </StatNumber>
          </Stat>
        </Card>

        <Card bg={cardBg} p={4} borderRadius="16px" boxShadow="sm" borderLeft="4px solid #dd6b20">
          <Stat>
            <StatLabel fontSize="xs" color="orange.600" fontWeight="bold">UNVERIFIED / PENDING</StatLabel>
            <StatNumber fontSize="2xl" color="orange.500" fontWeight="extrabold">
              {Math.max(0, (stats.total || 0) - (stats.verified || 0))}
            </StatNumber>
          </Stat>
        </Card>
      </SimpleGrid>

      {/* ==================== 2. MAIN TABLE CARD ==================== */}
      <Card overflow="hidden" flex="1" display="flex" flexDirection="column" mb={4} borderRadius="20px" boxShadow="md">
        <CardHeader p={{ base: "14px 16px", md: "20px 24px" }} borderBottom="1px solid" borderColor="gray.100">
          <Flex
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={3}
            w="100%"
          >
            <Box>
              <Text fontSize={{ base: "lg", md: "xl" }} color={textColor} fontWeight="bold">
                Member Grievance Management
              </Text>
              <Text fontSize="xs" color="gray.500">
                Review and verify grievances submitted by TNEBEA members.
              </Text>
            </Box>

            <HStack spacing={3} wrap="wrap">
              {/* Verification Filter */}
              <Select
                size="sm"
                borderRadius="10px"
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                w={{ base: "100%", sm: "160px" }}
              >
                <option value="ALL">All Grievances</option>
                <option value="VERIFIED">Verified Only</option>
                <option value="UNVERIFIED">Unverified Only</option>
              </Select>

              {/* Refresh Button */}
              <Button
                size="sm"
                onClick={() => {
                  fetchData();
                  fetchStats();
                }}
                colorScheme="blue"
                leftIcon={<FaSync />}
                borderRadius="10px"
              >
                Refresh
              </Button>
            </HStack>
          </Flex>

          {/* Search Row */}
          <Box mt={3} as="form" onSubmit={handleSearchSubmit}>
            <InputGroup size="sm" maxW={{ base: "100%", md: "400px" }}>
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray" />
              </InputLeftElement>
              <Input
                placeholder="Search by LM No, Name, District..."
                borderRadius="10px"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Box>
        </CardHeader>

        <CardBody display="flex" flexDirection="column" flex="1" p={0} overflow="hidden">
          {loading ? (
            <Flex justify="center" align="center" flex="1" p={12}>
              <Spinner size="xl" color={customColor} thickness="4px" />
            </Flex>
          ) : (
            <Box overflowY="auto" overflowX="auto" flex="1" px={{ base: 2, md: 4 }}>
              <Table variant="simple" color={textColor} minW="950px">
                <Thead>
                  <Tr my=".8rem" color="gray.400">
                    <Th color="gray.400" width="60px">S.No</Th>
                    <Th color="gray.400" width="130px">LM Number</Th>
                    <Th color="gray.400">Member Name</Th>
                    <Th color="gray.400">District</Th>
                    <Th color="gray.400" maxW="280px">Grievance Details</Th>
                    <Th color="gray.400">Attachment</Th>
                    <Th color="gray.400" textAlign="center">Verify Option</Th>
                    <Th color="gray.400">Submitted On</Th>
                    <Th color="gray.400" textAlign="center">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {grievances.map((item, index) => (
                    <Tr key={item._id} _hover={{ bg: "gray.50" }} transition="background 0.2s">
                      {/* S.No */}
                      <Td>
                        <Text fontSize="sm" fontWeight="bold" color={textColor}>
                          {index + 1}
                        </Text>
                      </Td>

                      {/* LM Number */}
                      <Td>
                        <Tag size="sm" colorScheme="blue" borderRadius="full">
                          <TagLabel fontWeight="bold">{item.lmNumber}</TagLabel>
                        </Tag>
                      </Td>

                      {/* Name */}
                      <Td>
                        <Text fontSize="sm" fontWeight="bold" color={textColor}>
                          {item.name}
                        </Text>
                      </Td>

                      {/* District */}
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {item.district || "—"}
                        </Text>
                      </Td>

                      {/* Grievance Details Snippet */}
                      <Td maxW="280px">
                        <Tooltip label={item.grievanceDetails} placement="top" hasArrow>
                          <Text
                            fontSize="sm"
                            color="gray.700"
                            noOfLines={2}
                            cursor="pointer"
                            onClick={() => openDetailsModal(item)}
                          >
                            {item.grievanceDetails}
                          </Text>
                        </Tooltip>
                      </Td>

                      {/* Attachment */}
                      <Td>
                        {item.attachmentUrl ? (
                          <Button
                            as="a"
                            href={item.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="xs"
                            colorScheme="teal"
                            variant="outline"
                            leftIcon={<FaPaperclip />}
                            borderRadius="6px"
                          >
                            View File
                          </Button>
                        ) : (
                          <Text fontSize="xs" color="gray.400">None</Text>
                        )}
                      </Td>

                      {/* Admin Verify Column with 1-click Toggle Action */}
                      <Td textAlign="center">
                        {item.isVerified ? (
                          <Tooltip label="Verified! Click to revoke verification" hasArrow>
                            <Button
                              size="xs"
                              colorScheme="green"
                              variant="solid"
                              leftIcon={<FaCheckCircle />}
                              borderRadius="20px"
                              onClick={() => handleToggleVerify(item)}
                            >
                              Verified
                            </Button>
                          </Tooltip>
                        ) : (
                          <Tooltip label="Click to verify this grievance" hasArrow>
                            <Button
                              size="xs"
                              colorScheme="blue"
                              variant="outline"
                              leftIcon={<FaShieldAlt />}
                              borderRadius="20px"
                              onClick={() => handleToggleVerify(item)}
                            >
                              Verify
                            </Button>
                          </Tooltip>
                        )}
                      </Td>

                      {/* Date */}
                      <Td>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(item.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </Text>
                      </Td>

                      {/* Actions */}
                      <Td textAlign="center">
                        <HStack spacing={1} justify="center">
                          <Tooltip label="View Full Details" hasArrow>
                            <Button
                              variant="ghost"
                              colorScheme="blue"
                              size="sm"
                              onClick={() => openDetailsModal(item)}
                            >
                              <Icon as={FaEye} />
                            </Button>
                          </Tooltip>
                          <Tooltip label="Delete Grievance" hasArrow>
                            <Button
                              variant="ghost"
                              colorScheme="red"
                              size="sm"
                              onClick={() => promptDelete(item._id)}
                            >
                              <Icon as={FaTrash} />
                            </Button>
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}

                  {grievances.length === 0 && (
                    <Tr>
                      <Td colSpan={9} textAlign="center" py={10}>
                        <VStack spacing={2}>
                          <Icon as={FaFileAlt} w={8} h={8} color="gray.300" />
                          <Text color="gray.500" fontSize="sm">
                            No grievances found matching the current search / filter criteria.
                          </Text>
                        </VStack>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* ==================== 3. VIEW & MANAGE DETAILS MODAL ==================== */}
      {selectedGrievance && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl" isCentered>
          <ModalOverlay />
          <ModalContent borderRadius="18px">
            <ModalHeader borderBottom="1px solid" borderColor="gray.100" pb={3}>
              <Flex justify="space-between" align="center" pr={6}>
                <Box>
                  <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    Grievance Details
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    ID: {selectedGrievance._id}
                  </Text>
                </Box>
                {selectedGrievance.isVerified ? (
                  <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                    <Icon as={FaCheckCircle} mr={1} /> VERIFIED
                  </Badge>
                ) : (
                  <Badge colorScheme="orange" px={3} py={1} borderRadius="full">
                    <Icon as={FaClock} mr={1} /> UNVERIFIED
                  </Badge>
                )}
              </Flex>
            </ModalHeader>
            <ModalCloseButton />

            <ModalBody py={5}>
              <VStack spacing={4} align="stretch">
                {/* Member Identity Details */}
                <SimpleGrid columns={2} spacing={3} bg="gray.50" p={3} borderRadius="12px">
                  <Box>
                    <Text fontSize="xs" color="gray.500" fontWeight="bold">LM NUMBER</Text>
                    <Text fontSize="sm" fontWeight="bold" color="blue.600">
                      {selectedGrievance.lmNumber}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500" fontWeight="bold">MEMBER NAME</Text>
                    <Text fontSize="sm" fontWeight="bold" color={textColor}>
                      {selectedGrievance.name}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500" fontWeight="bold">DISTRICT</Text>
                    <Text fontSize="sm" color={textColor}>
                      {selectedGrievance.district || "Not Specified"}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs" color="gray.500" fontWeight="bold">SUBMISSION DATE</Text>
                    <Text fontSize="sm" color={textColor}>
                      {new Date(selectedGrievance.createdAt).toLocaleString("en-IN")}
                    </Text>
                  </Box>
                </SimpleGrid>

                {/* Grievance Text */}
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold" mb={1}>
                    GRIEVANCE DETAILS
                  </Text>
                  <Box
                    p={4}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="10px"
                    maxH="200px"
                    overflowY="auto"
                    fontSize="sm"
                    color="gray.800"
                    lineHeight="1.6"
                    whiteSpace="pre-wrap"
                  >
                    {selectedGrievance.grievanceDetails}
                  </Box>
                </Box>

                {/* Attachment info */}
                {selectedGrievance.attachmentUrl ? (
                  <Box p={3} bg="blue.50" borderRadius="10px" border="1px solid" borderColor="blue.100">
                    <Flex justify="space-between" align="center">
                      <HStack spacing={3}>
                        <Icon as={FaPaperclip} color="blue.600" />
                        <Box>
                          <Text fontSize="xs" fontWeight="bold" color="blue.800">
                            {selectedGrievance.fileName || "Supporting Attachment"}
                          </Text>
                          {selectedGrievance.fileSize && (
                            <Text fontSize="xs" color="gray.500">
                              {(selectedGrievance.fileSize / (1024 * 1024)).toFixed(2)} MB
                            </Text>
                          )}
                        </Box>
                      </HStack>
                      <Button
                        as="a"
                        href={selectedGrievance.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="xs"
                        colorScheme="blue"
                        rightIcon={<FaExternalLinkAlt />}
                      >
                        Download / Open
                      </Button>
                    </Flex>
                  </Box>
                ) : (
                  <Text fontSize="xs" color="gray.500">
                    No supporting attachment uploaded with this submission.
                  </Text>
                )}

                <Divider />

                {/* ==================== VERIFICATION ACTION BOX ==================== */}
                <Box p={4} bg="gray.50" borderRadius="12px" border="1px solid" borderColor="gray.200">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color={textColor}>
                        Admin Verification
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {selectedGrievance.isVerified
                          ? `Verified by ${selectedGrievance.verifiedByName || "Admin"} on ${selectedGrievance.verifiedAt ? new Date(selectedGrievance.verifiedAt).toLocaleDateString() : "Record"}`
                          : "Not yet verified by CEC Admin"}
                      </Text>
                    </Box>
                    <Button
                      size="sm"
                      colorScheme={selectedGrievance.isVerified ? "red" : "green"}
                      variant={selectedGrievance.isVerified ? "outline" : "solid"}
                      leftIcon={selectedGrievance.isVerified ? <FaTimesCircle /> : <FaCheckCircle />}
                      onClick={() => handleToggleVerify(selectedGrievance)}
                    >
                      {selectedGrievance.isVerified ? "Revoke Verification" : "Verify Grievance"}
                    </Button>
                  </Flex>
                </Box>

                {/* Remarks */}
                <Box>
                  <Text fontSize="xs" color="gray.500" fontWeight="bold" mb={2}>
                    OFFICIAL REMARKS / NOTES
                  </Text>
                  <HStack spacing={3} mb={2}>
                    <Textarea
                      size="sm"
                      placeholder="Add official administrative remarks or notes..."
                      value={modalRemarks}
                      onChange={(e) => setModalRemarks(e.target.value)}
                      borderRadius="8px"
                      rows={2}
                    />
                  </HStack>
                  <Button
                    size="xs"
                    colorScheme="blue"
                    onClick={handleSaveRemarks}
                    isLoading={isSavingRemarks}
                  >
                    Save Remarks
                  </Button>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter borderTop="1px solid" borderColor="gray.100">
              <Button size="sm" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* ==================== 4. DELETE CONFIRMATION DIALOG ==================== */}
      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={() => setIsAlertOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="16px">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="red.600">
              Delete Grievance
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this grievance? This will completely remove the grievance from the database and delete any attached file from Bunny CDN storage. This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete Permanently
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}

export default Grievances;
