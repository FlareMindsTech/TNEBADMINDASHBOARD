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
  ModalCloseButton,
  VStack,
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState, useEffect } from "react";
import { FaEye, FaSync, FaTrash, FaCheckCircle } from "react-icons/fa";
import { getAllApplications, deleteApplication, updateApplicationStatus, showErrorToast } from "views/utils/axiosInstance";
import { EBFViewer } from "./EBFViewer";
import { LifeViewer } from "./LifeViewer";

function Enrollments() {
  const textColor = useColorModeValue("gray.700", "white");
  const customColor = "#0A3D91";
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  
  // Modal State for Viewing Detailed Form Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  // Alert Dialog State for Deletions
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const cancelRef = React.useRef();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllApplications();
      setApplications(data || []);
    } catch (error) {
       console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const promptDelete = (id) => {
    setDeleteId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    setIsAlertOpen(false);
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteApplication(deleteId);
      toast({ title: "Application Deleted", description: "Successfully removed application.", status: "success", duration: 3000, isClosable: true });
      fetchData();
    } catch (error) {
      showErrorToast(toast, error, "Failed to delete application.");
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    setLoading(true);
    try {
      await updateApplicationStatus(id, "VERIFIED");
      toast({ title: "Verified", description: "Form successfully marked as verified.", status: "success", duration: 3000, isClosable: true });
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      showErrorToast(toast, error, "Failed to verify application.");
      setLoading(false);
    }
  };

  if (isModalOpen && selectedForm) {
    return (
      <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }} minH="100vh">
         <Card overflow="visible" flex="1" display="flex" flexDirection="column" mb={4}>
           <CardHeader p={{ base: "14px 16px", md: "18px 24px" }}>
             <Flex justify="space-between" align="center" w="100%">
               <Text fontSize="xl" color={textColor} fontWeight="bold">
                  {selectedForm.formType} Form Display
                  {selectedForm.status === 'VERIFIED' && <Badge colorScheme="green" ml={3}>VERIFIED</Badge>}
               </Text>
               <Flex gap={3}>
                 {selectedForm.status !== 'VERIFIED' && (
                   <Button size="sm" onClick={() => handleVerify(selectedForm._id)} colorScheme="green" leftIcon={<FaCheckCircle/>}>
                      Verify Form
                   </Button>
                 )}
                 <Button size="sm" onClick={() => setIsModalOpen(false)} colorScheme="red" variant="outline">
                    Back to List
                 </Button>
               </Flex>
             </Flex>
           </CardHeader>
           <CardBody display="flex" flexDirection="column" flex="1" bg="#e2e8f0" p={8} overflow="auto">
              {selectedForm.formType === 'LIFE-MEMBERSHIP' ? (
                <LifeViewer formData={selectedForm.formData} />
              ) : (
                <EBFViewer formData={selectedForm.formData} />
              )}
           </CardBody>
         </Card>
      </Flex>
    );
  }

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }} h="calc(100vh - 20px)">
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} flex="1" display="flex" flexDirection="column" overflow="hidden" mb={4}>
        <CardHeader p={{ base: "14px 16px", md: "18px 24px" }} flexShrink={0}>
          <Flex justify="space-between" align={{ base: "stretch", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3} w="100%">
            <Text fontSize={{ base: "lg", md: "xl" }} color={textColor} fontWeight="bold">User Enrollment Applications</Text>
            <Button size="sm" onClick={fetchData} colorScheme="blue" leftIcon={<FaSync/>}>Refresh Data</Button>
          </Flex>
        </CardHeader>
        <CardBody display="flex" flexDirection="column" flex="1" overflow="hidden" p={0}>
          {loading ? (
            <Flex justify="center" align="center" flex="1" p={8}><Spinner color={customColor} /></Flex>
          ) : (
            <Box overflowY="auto" overflowX="auto" flex="1" px={{ base: 2, md: 4 }}>
              <Table variant="simple" color={textColor} minW={{ base: "550px", md: "100%" }}>
                <Thead>
                  <Tr my=".8rem" pl="0px" color="gray.400">
                    <Th color="gray.400">S.No</Th>
                    <Th color="gray.400">Date</Th>
                    <Th color="gray.400">Form Type</Th>
                    <Th color="gray.400">Status</Th>
                    <Th color="gray.400" textAlign="center">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {applications.map((app, index) => (
                    <Tr key={app._id}>
                      <Td><Text fontSize="sm" color={textColor} fontWeight="bold">{index + 1}</Text></Td>
                      <Td><Text fontSize="sm" color={textColor}>{new Date(app.createdAt).toLocaleDateString()}</Text></Td>
                      <Td><Badge colorScheme="purple">{app.formType}</Badge></Td>
                      <Td><Badge colorScheme={app.status === 'PENDING' ? 'orange' : 'green'}>{app.status}</Badge></Td>
                      <Td textAlign="center">
                        <Button variant="ghost" colorScheme="blue" size="sm" onClick={() => {
                          setSelectedForm(app);
                          setIsModalOpen(true);
                        }}>
                           <Icon as={FaEye} mr={2} /> View Details
                        </Button>
                        <Button variant="ghost" colorScheme="red" size="sm" ml={2} onClick={() => promptDelete(app._id)}>
                           <Icon as={FaTrash} /> Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                  {applications.length === 0 && (
                    <Tr>
                      <Td colSpan={5} textAlign="center" py={4}>No applications currently exist in the database.</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Application
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to completely erase this application? This will instantly destruct and wipe all associated documents, signatures, and photos stored on Bunny CDN. This cannot be undone!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Dangerous Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}

export default Enrollments;
