import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    Icon,
    Input,
    Select,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useToast,
    Heading,
    Text,
    Badge,
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState, useEffect } from "react";
import {
    FaArrowLeft,
    FaPlus,
    FaTrash,
    FaEdit,
    FaFilePdf,
    FaFileAlt,
    FaChevronLeft,
    FaChevronRight,
    FaExclamationTriangle
} from "react-icons/fa";
import {
    getAllForms,
    createForm,
    updateForm,
    deleteForm,
    showErrorToast
} from "views/utils/axiosInstance";

function Forms() {
    const textColor = useColorModeValue("gray.700", "white");
    const customColor = "#0A3D91";
    const customHoverColor = "#1E88E5";
    const toast = useToast();

    const [currentView, setCurrentView] = useState("list");
    const [loading, setLoading] = useState(false);
    const [forms, setForms] = useState([]);
    const [editingForm, setEditingForm] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Delete modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentForms = forms.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(forms.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const [formData, setFormData] = useState({
        title: "",
        type: "form",
        pdf: null
    });

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        setLoading(true);
        try {
            const data = await getAllForms();
            let formsList = Array.isArray(data) ? data : [];

            // Sort descending (newest first)
            const sortedForms = [...formsList].sort((a, b) => {
                const dateA = new Date(a.createdAt || a.date || a.updatedAt || 0).getTime();
                const dateB = new Date(b.createdAt || b.date || b.updatedAt || 0).getTime();
                if (dateA && dateB && dateA !== dateB && !isNaN(dateA) && !isNaN(dateB)) {
                    return dateB - dateA;
                }
                return String(b._id || b.id || '').localeCompare(String(a._id || a.id || ''));
            });

            setForms(sortedForms);
        } catch (error) {
            showErrorToast(toast, error, { title: "Failed to load forms" });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        setCurrentView("list");
        setEditingForm(null);
        setFormData({ title: "", type: "form", pdf: null });
    };

    const handleAddForm = () => {
        setEditingForm(null);
        setFormData({ title: "", type: "form", pdf: null });
        setCurrentView("add");
    };

    const handleEditForm = (form) => {
        setEditingForm(form);
        setFormData({
            title: form.title || "",
            type: form.type || "form",
            pdf: null // Cannot pre-fill file input
        });
        setCurrentView("edit");
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'pdf') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("title", formData.title);
        data.append("type", formData.type);
        if (formData.pdf) {
            data.append("pdf", formData.pdf);
        }

        try {
            if (currentView === "edit" && editingForm) {
                await updateForm(editingForm._id, data);
                toast({ title: "Form updated successfully", status: "success", duration: 3000 });
            } else {
                await createForm(data);
                toast({ title: "Form created successfully", status: "success", duration: 3000 });
            }
            fetchForms();
            handleBackToList();
        } catch (error) {
            showErrorToast(toast, error);
        } finally {
            setLoading(false);
        }
    };

    const openDeleteModal = (id) => {
        setDeleteTarget(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        setIsDeleting(true);
        try {
            await deleteForm(deleteTarget);
            toast({ title: "Form deleted successfully", status: "success", duration: 2000 });
            fetchForms();
            closeDeleteModal();
        } catch (error) {
            showErrorToast(toast, error, { title: "Delete Failed" });
        } finally {
            setIsDeleting(false);
        }
    };

    if (currentView === "add" || currentView === "edit") {
        return (
            <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }} height="100vh" overflow="auto">
                <Card bg="white" shadow="xl" height="100%" display="flex" flexDirection="column">
                    <CardHeader bg="white" flexShrink={0}>
                        <Flex align="center" justify="space-between" mb={4} w="100%">
                            <Flex align="center">
                                <Button variant="ghost" leftIcon={<FaArrowLeft />} onClick={handleBackToList} mr={4} color={customColor} _hover={{ bg: `${customColor}10` }}>
                                    Back
                                </Button>
                                <Heading size="md" color="gray.700">{currentView === "add" ? "Create Form / Loan" : "Edit Form / Loan"}</Heading>
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardBody bg="white" flex="1" overflow="auto">
                        <Box as="form" onSubmit={handleSubmit}>
                            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4} mb={4}>
                                <FormControl isRequired>
                                    <FormLabel color="gray.700">Title</FormLabel>
                                    <Input name="title" placeholder="Form or Loan Title" value={formData.title} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel color="gray.700">Type</FormLabel>
                                    <Select name="type" value={formData.type} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor }}>
                                        <option value="form">Form</option>
                                        <option value="loan">Loan</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel color="gray.700">Document File (Optional)</FormLabel>
                                    <Box border={`1px dashed ${customColor}50`} p={2} borderRadius="md" _hover={{ borderColor: customColor }}>
                                        <Input type="file" name="pdf" accept=".pdf,.doc,.docx" pt={1} variant="unstyled" onChange={handleInputChange} />
                                    </Box>
                                    {currentView === "edit" && editingForm?.pdfUrl && (
                                        <Text fontSize="xs" mt={2} color="gray.500">Current file exists. Upload new to replace.</Text>
                                    )}
                                </FormControl>
                            </SimpleGrid>
                            <Button type="submit" isLoading={loading} bg={customColor} color="white" _hover={{ bg: customHoverColor }} mt={4} width="100%">
                                {currentView === "add" ? "Create" : "Update"}
                            </Button>
                        </Box>
                    </CardBody>
                </Card>
            </Flex>
        );
    }

    const renderStats = () => (
        <Flex flexDirection={{ base: "column", sm: "row" }} gap={4} mb={4} w="100%">
            <Card minH="83px" cursor="pointer" bg="white" w={{ base: "100%", sm: "240px", md: "30%", lg: "25%" }} border={`1px solid ${customColor}30`} _hover={{ borderColor: customColor, transform: "translateY(-4px)" }} transition="all 0.2s">
                <CardBody>
                    <Flex align="center" justify="space-between">
                        <Stat>
                            <StatLabel color="gray.600" fontWeight="bold">Total Documents</StatLabel>
                            <StatNumber fontSize="xl">{forms.length}</StatNumber>
                        </Stat>
                        <Flex alignItems="center" justifyContent="center" borderRadius="12px" bg={customColor} color="white" h="45px" w="45px" flexShrink={0}>
                            <Icon as={FaFileAlt} w="22px" h="22px" />
                        </Flex>
                    </Flex>
                </CardBody>
            </Card>
        </Flex>
    );

    return (
        <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }} h="calc(100vh - 20px)">
            {renderStats()}
            <Card overflowX={{ sm: "scroll", xl: "hidden" }} flex="1" display="flex" flexDirection="column" overflow="hidden" mb={4}>
                <CardHeader p={{ base: "14px 16px", md: "18px 24px" }} flexShrink={0}>
                    <Flex justify="space-between" align={{ base: "stretch", sm: "center" }} direction={{ base: "column", sm: "row" }} gap={3} w="100%">
                        <Text fontSize={{ base: "lg", md: "xl" }} color={textColor} fontWeight="bold">Forms / Loans Table</Text>
                        <Button
                            bg="linear-gradient(135deg, #0A3D91 0%, #1557bf 100%)"
                            color="white"
                            px={{ base: "20px", md: "24px" }}
                            py="10px"
                            minH="42px"
                            minW="fit-content"
                            borderRadius="10px"
                            boxShadow="0 4px 12px rgba(10, 61, 145, 0.25)"
                            _hover={{
                                bg: "linear-gradient(135deg, #083075 0%, #0A3D91 100%)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 18px rgba(10, 61, 145, 0.35)",
                            }}
                            _active={{
                                transform: "translateY(0)",
                                boxShadow: "0 2px 6px rgba(10, 61, 145, 0.2)",
                            }}
                            transition="all 0.2s ease"
                            onClick={handleAddForm}
                        >
                            <Flex align="center" gap="8px">
                                <Icon as={FaPlus} boxSize="13px" />
                                <Text fontSize="sm" fontWeight="600" letterSpacing="0.2px">
                                    Add Form / Loan
                                </Text>
                            </Flex>
                        </Button>
                    </Flex>
                </CardHeader>
                <CardBody display="flex" flexDirection="column" flex="1" overflow="hidden" p={0}>
                    {loading && forms.length === 0 ? (
                        <Flex justify="center" align="center" flex="1" p={8}><Spinner color={customColor} /></Flex>
                    ) : (
                        <Box overflowY="auto" overflowX="auto" flex="1" px={{ base: 2, md: 4 }}>
                            <Table variant="simple" color={textColor} minW={{ base: "550px", md: "100%" }}>
                                <Thead>
                                    <Tr my=".8rem" pl="0px" color="gray.400">
                                        <Th color="gray.400">S.No</Th>
                                        <Th color="gray.400">Title</Th>
                                        <Th color="gray.400">Type</Th>
                                        <Th color="gray.400">Created Date</Th>
                                        <Th color="gray.400" textAlign="center">Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {currentForms.map((form, index) => (
                                        <Tr key={form._id}>
                                            <Td><Text fontSize="sm" color={textColor} fontWeight="bold">{indexOfFirstItem + index + 1}</Text></Td>
                                            <Td><Text fontSize="sm" color={textColor} fontWeight="bold">{form.title}</Text></Td>
                                            <Td>
                                                <Badge colorScheme={form.type === 'loan' ? 'green' : 'blue'}>
                                                    {form.type ? form.type.toUpperCase() : "FORM"}
                                                </Badge>
                                            </Td>
                                            <Td><Text fontSize="sm" color={textColor} whiteSpace="nowrap">{form.createdAt ? form.createdAt.split('T')[0].split('-').reverse().join('-') : "N/A"}</Text></Td>
                                            <Td textAlign="center">
                                                <Flex justify="center">
                                                    {form.pdfUrl && (
                                                        <Button as="a" href={form.pdfUrl} target="_blank" variant="ghost" colorScheme="orange" size="sm" mr={1}>
                                                            <Icon as={FaFilePdf} />
                                                        </Button>
                                                    )}
                                                    <Button variant="ghost" colorScheme="blue" size="sm" mr={1} onClick={() => handleEditForm(form)}><Icon as={FaEdit} /></Button>
                                                    <Button variant="ghost" colorScheme="red" size="sm" onClick={() => openDeleteModal(form._id)}><Icon as={FaTrash} /></Button>
                                                </Flex>
                                            </Td>
                                        </Tr>
                                    ))}
                                    {forms.length === 0 && (
                                        <Tr>
                                            <Td colSpan={5} textAlign="center" py={4}>No forms or loans found.</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                    {forms.length > 0 && (
                        <Box flexShrink={0} px={{ base: "12px", md: "20px" }} py="10px" borderTop="1px solid" borderColor="gray.100" bg="white">
                            <Flex justify="space-between" align="center" direction={{ base: "column", sm: "row" }} gap={2}>
                                <Flex align="center" justify={{ base: "space-between", sm: "flex-start" }} w={{ base: "100%", sm: "auto" }}>
                                    <Flex align="center">
                                        <Text fontSize="xs" mr={1} color="gray.500" whiteSpace="nowrap">Rows:</Text>
                                        <Select
                                            w="65px"
                                            size="xs"
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                        </Select>
                                    </Flex>
                                    <Text fontSize="xs" color="gray.600" ml={3} whiteSpace="nowrap">
                                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, forms.length)} of {forms.length}
                                    </Text>
                                </Flex>

                                <Flex align="center" justify={{ base: "center", sm: "flex-end" }} w={{ base: "100%", sm: "auto" }} gap={1}>
                                    <Button
                                        size="xs"
                                        onClick={handlePrevPage}
                                        isDisabled={currentPage === 1}
                                        leftIcon={<FaChevronLeft />}
                                        bg="white"
                                        color={customColor}
                                        border="1px"
                                        borderColor={customColor}
                                        _hover={{ bg: customColor, color: "white" }}
                                        _disabled={{
                                            opacity: 0.5,
                                            cursor: "not-allowed",
                                            bg: "gray.100",
                                            color: "gray.400",
                                            borderColor: "gray.300"
                                        }}
                                    >
                                        Previous
                                    </Button>
                                    <Text fontSize="xs" mx={2} color="gray.600" whiteSpace="nowrap">
                                        Page {currentPage} of {totalPages}
                                    </Text>
                                    <Button
                                        size="xs"
                                        onClick={handleNextPage}
                                        isDisabled={currentPage === totalPages}
                                        rightIcon={<FaChevronRight />}
                                        bg="white"
                                        color={customColor}
                                        border="1px"
                                        borderColor={customColor}
                                        _hover={{ bg: customColor, color: "white" }}
                                        _disabled={{
                                            opacity: 0.5,
                                            cursor: "not-allowed",
                                            bg: "gray.100",
                                            color: "gray.400",
                                            borderColor: "gray.300"
                                        }}
                                    >
                                        Next
                                    </Button>
                                </Flex>
                            </Flex>
                        </Box>
                    )}
                </CardBody>
            </Card>

            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} isCentered>
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
                <ModalContent borderRadius="xl" mx={4}>
                    <ModalHeader pb={2}>
                        <Flex align="center" gap={3}>
                            <Flex alignItems="center" justifyContent="center" borderRadius="full" bg="red.50" color="red.500" h="40px" w="40px">
                                <Icon as={FaExclamationTriangle} w="18px" h="18px" />
                            </Flex>
                            <Text fontSize="lg" fontWeight="bold" color="gray.700">Confirm Delete</Text>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text color="gray.600">Are you sure you want to delete this document? This action cannot be undone.</Text>
                    </ModalBody>
                    <ModalFooter gap={3}>
                        <Button variant="outline" onClick={closeDeleteModal} borderColor="gray.300" color="gray.600" _hover={{ bg: "gray.50" }}>Cancel</Button>
                        <Button bg={customColor} color="white" _hover={{ bg: customHoverColor }} onClick={handleConfirmDelete} isLoading={isDeleting} loadingText="Deleting..." leftIcon={<Icon as={FaTrash} />}>Delete</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default Forms;
