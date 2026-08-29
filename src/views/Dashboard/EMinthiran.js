import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Flex,
    Icon,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Text,
    useColorModeValue,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Select,
    useToast,
    Spinner,
    Heading,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    HStack,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import {
    FaPlus,
    FaTrash,
    FaEdit,
    FaDownload,
    FaFilePdf,
    FaArrowLeft,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import {
    getAllMinthiran,
    createMinthiran,
    updateMinthiran,
    deleteMinthiran,
    showErrorToast,
} from "views/utils/axiosInstance";

function EMinthiran() {
    const textColor = useColorModeValue("gray.700", "white");
    const customColor = "#0A3D91";
    const customHoverColor = "#1E88E5";
    const toast = useToast();

    const [currentView, setCurrentView] = useState("list");
    const [loading, setLoading] = useState(false);
    const [pdfs, setPdfs] = useState([]);
    const [editingPdf, setEditingPdf] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [deleteId, setDeleteId] = useState(null);

    // Filters
    const [filterYear, setFilterYear] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Form state
    const [formData, setFormData] = useState({
        year: new Date().getFullYear().toString(),
        month: "January",
        pdf: null,
    });

    useEffect(() => {
        fetchMagazines();
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterYear, filterMonth, startDate, endDate]);

    const fetchMagazines = async () => {
        setLoading(true);
        try {
            const data = await getAllMinthiran();
            let all = [];
            if (Array.isArray(data)) {
                data.forEach((yearGroup) => {
                    if (yearGroup.issues && Array.isArray(yearGroup.issues)) {
                        yearGroup.issues.forEach((issue) => {
                            all.push({
                                ...issue,
                                year: yearGroup.year,
                                parentId: yearGroup._id,
                            });
                        });
                    } else {
                        all.push(yearGroup);
                    }
                });
            } else if (data && typeof data === "object") {
                if (data.minthiran && Array.isArray(data.minthiran)) {
                    all = data.minthiran;
                } else {
                    all = Object.values(data).reduce((acc, curr) => {
                        if (Array.isArray(curr)) return acc.concat(curr);
                        return acc;
                    }, []);
                }
            }

            const monthOrder = {
                january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
                july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
            };

            // Sort descending: highest year first, latest month first
            all.sort((a, b) => {
                const yearDiff = (Number(b.year) || 0) - (Number(a.year) || 0);
                if (yearDiff !== 0) return yearDiff;
                const monthA = monthOrder[(a.month || "").toLowerCase()] || 0;
                const monthB = monthOrder[(b.month || "").toLowerCase()] || 0;
                if (monthB !== monthA) return monthB - monthA;
                return String(b._id || b.id || "").localeCompare(String(a._id || a.id || ""));
            });

            setPdfs(all);
        } catch (error) {
            showErrorToast(toast, error, { title: "Failed to load magazines" });
        } finally {
            setLoading(false);
        }
    };

    // Calculate Unique Years for Filter
    const uniqueYears = [...new Set(pdfs.map((pdf) => pdf.year))].filter(Boolean).sort((a, b) => b - a);

    // Filter Logic
    const filteredItems = pdfs.filter((pdf) => {
        let matchesYear = true;
        let matchesMonth = true;
        let matchesDate = true;

        if (filterYear) {
            matchesYear = pdf.year?.toString() === filterYear;
        }

        if (filterMonth) {
            matchesMonth = (pdf.month || "").toLowerCase() === filterMonth.toLowerCase();
        }

        if (startDate && endDate) {
            const pdfDate = new Date(pdf.createdAt || pdf.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            matchesDate = pdfDate >= start && pdfDate <= end;
        } else if (startDate) {
            const pdfDate = new Date(pdf.createdAt || pdf.date);
            const start = new Date(startDate);
            matchesDate = pdfDate >= start;
        } else if (endDate) {
            const pdfDate = new Date(pdf.createdAt || pdf.date);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            matchesDate = pdfDate <= end;
        }

        return matchesYear && matchesMonth && matchesDate;
    });

    // Pagination Calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPdfs = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

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

    const handleBackToList = () => {
        setCurrentView("list");
        setEditingPdf(null);
        setFormData({ year: new Date().getFullYear().toString(), month: "January", pdf: null });
    };

    const handleAddMagazine = () => {
        setEditingPdf(null);
        setFormData({ year: new Date().getFullYear().toString(), month: "January", pdf: null });
        setCurrentView("add");
    };

    const handleEditMagazine = (pdf) => {
        setEditingPdf(pdf);
        setFormData({
            year: pdf.year || "",
            month: pdf.month || "January",
            pdf: null,
        });
        setCurrentView("edit");
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "pdf") {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("year", formData.year);
        data.append("month", formData.month);
        if (formData.pdf) {
            data.append("pdf", formData.pdf);
        }

        try {
            if (currentView === "edit" && editingPdf) {
                await updateMinthiran(editingPdf._id || editingPdf.id, data);
                toast({ title: "Magazine updated successfully", status: "success", duration: 3000, isClosable: true });
            } else {
                await createMinthiran(data);
                toast({ title: "Magazine created successfully", status: "success", duration: 3000, isClosable: true });
            }
            fetchMagazines();
            handleBackToList();
        } catch (error) {
            showErrorToast(toast, error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMagazine = (id) => {
        setDeleteId(id);
        onOpen();
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        try {
            await deleteMinthiran(deleteId);
            toast({ title: "Magazine deleted successfully", status: "success", duration: 2000, isClosable: true });
            fetchMagazines();
            onClose();
        } catch (error) {
            showErrorToast(toast, error, { title: "Delete Failed" });
        } finally {
            setLoading(false);
            setDeleteId(null);
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
                                <Heading size="md" color="gray.700">{currentView === "add" ? "Upload Magazine" : "Edit Magazine"}</Heading>
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardBody bg="white" flex="1" overflow="auto">
                        <Box as="form" onSubmit={handleSubmit}>
                            <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4} mb={4}>
                                <FormControl isRequired>
                                    <FormLabel color="gray.700">Year</FormLabel>
                                    <Input name="year" placeholder="2025" value={formData.year} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }} _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }} />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel color="gray.700">Month</FormLabel>
                                    <Select name="month" value={formData.month} onChange={handleInputChange} borderColor={`${customColor}50`} _hover={{ borderColor: customColor }}>
                                        <option value="January">January</option>
                                        <option value="February">February</option>
                                        <option value="March">March</option>
                                        <option value="April">April</option>
                                        <option value="May">May</option>
                                        <option value="June">June</option>
                                        <option value="July">July</option>
                                        <option value="August">August</option>
                                        <option value="September">September</option>
                                        <option value="October">October</option>
                                        <option value="November">November</option>
                                        <option value="December">December</option>
                                    </Select>
                                </FormControl>
                                <FormControl isRequired={currentView === "add"}>
                                    <FormLabel color="gray.700">PDF File</FormLabel>
                                    <Box border={`1px dashed ${customColor}50`} p={2} borderRadius="md" _hover={{ borderColor: customColor }}>
                                        <Input type="file" name="pdf" accept=".pdf" pt={1} variant="unstyled" onChange={handleInputChange} />
                                    </Box>
                                    {currentView === "edit" && editingPdf?.pdf && (
                                        <Text fontSize="xs" mt={2} color="gray.500">Existing PDF file attached.</Text>
                                    )}
                                </FormControl>
                            </SimpleGrid>
                            <Button type="submit" isLoading={loading} bg={customColor} color="white" _hover={{ bg: customHoverColor }} mt={4} width="100%">
                                {currentView === "add" ? "Create Minthiran" : "Update Minthiran"}
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
                            <StatLabel color="gray.600" fontWeight="bold">Total Magazines</StatLabel>
                            <StatNumber fontSize="xl">{pdfs.length}</StatNumber>
                        </Stat>
                        <Flex alignItems="center" justifyContent="center" borderRadius="12px" bg={customColor} color="white" h="45px" w="45px" flexShrink={0}>
                            <Icon as={IoCheckmarkDoneCircleSharp} w="22px" h="22px" />
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
                        <Text fontSize={{ base: "lg", md: "xl" }} color={textColor} fontWeight="bold">E-Minthiran Table</Text>
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
                            onClick={handleAddMagazine}
                        >
                            <Flex align="center" gap="8px">
                                <Icon as={FaPlus} boxSize="13px" />
                                <Text fontSize="sm" fontWeight="600" letterSpacing="0.2px">
                                    Upload Magazine
                                </Text>
                            </Flex>
                        </Button>
                    </Flex>
                </CardHeader>
                <CardBody display="flex" flexDirection="column" flex="1" overflow="hidden" p={0}>
                    {/* Filters */}
                    <Flex px={{ base: 4, md: 6 }} py={2} gap={3} wrap="wrap" alignItems="flex-end" borderBottom="1px solid" borderColor="gray.100">
                        <FormControl w={{ base: "100%", sm: "140px" }}>
                            <FormLabel fontSize="xs" color="gray.500" mb={1}>Year</FormLabel>
                            <Select placeholder="All Years" value={filterYear} onChange={(e) => setFilterYear(e.target.value)} size="xs">
                                {uniqueYears.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl w={{ base: "100%", sm: "140px" }}>
                            <FormLabel fontSize="xs" color="gray.500" mb={1}>Month</FormLabel>
                            <Select placeholder="All Months" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} size="xs">
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </Select>
                        </FormControl>
                        <FormControl w={{ base: "100%", sm: "140px" }}>
                            <FormLabel fontSize="xs" color="gray.500" mb={1}>Start Date</FormLabel>
                            <Input type="date" size="xs" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </FormControl>
                        <FormControl w={{ base: "100%", sm: "140px" }}>
                            <FormLabel fontSize="xs" color="gray.500" mb={1}>End Date</FormLabel>
                            <Input type="date" size="xs" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </FormControl>
                        <Button size="xs" onClick={() => { setFilterYear(""); setFilterMonth(""); setStartDate(""); setEndDate(""); }} colorScheme="gray" variant="outline">
                            Clear
                        </Button>
                    </Flex>

                    {loading && pdfs.length === 0 ? (
                        <Flex justify="center" align="center" flex="1" p={8}><Spinner color={customColor} /></Flex>
                    ) : (
                        <Box overflowY="auto" overflowX="auto" flex="1" px={{ base: 2, md: 4 }}>
                            <Table variant="simple" color={textColor} minW={{ base: "550px", md: "100%" }}>
                                <Thead>
                                    <Tr my=".8rem" pl="0px" color="gray.400">
                                        <Th color="gray.400">S.No</Th>
                                        <Th color="gray.400">Title / File</Th>
                                        <Th color="gray.400">Year</Th>
                                        <Th color="gray.400">Month</Th>
                                        <Th color="gray.400" textAlign="center">Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {currentPdfs.map((pdf, index) => (
                                        <Tr key={pdf._id || pdf.id}>
                                            <Td><Text fontSize="sm" color={textColor} fontWeight="bold">{indexOfFirstItem + index + 1}</Text></Td>
                                            <Td>
                                                <Flex align="center">
                                                    <Icon as={FaFilePdf} color="red.500" mr={2} />
                                                    <Text fontSize="sm" color={textColor} fontWeight="bold">{pdf.title || `Minthiran ${pdf.month} ${pdf.year}`}</Text>
                                                </Flex>
                                            </Td>
                                            <Td><Text fontSize="sm" color={textColor}>{pdf.year}</Text></Td>
                                            <Td><Text fontSize="sm" color={textColor}>{pdf.month}</Text></Td>
                                            <Td textAlign="center">
                                                <Flex justify="center">
                                                    {pdf.pdf?.url && (
                                                        <Button as="a" href={pdf.pdf.url} target="_blank" variant="ghost" colorScheme="blue" size="sm" mr={1}><Icon as={FaDownload} /></Button>
                                                    )}
                                                    <Button variant="ghost" colorScheme="orange" size="sm" mr={1} onClick={() => handleEditMagazine(pdf)}><Icon as={FaEdit} /></Button>
                                                    <Button variant="ghost" colorScheme="red" size="sm" onClick={() => handleDeleteMagazine(pdf._id || pdf.id)}><Icon as={FaTrash} /></Button>
                                                </Flex>
                                            </Td>
                                        </Tr>
                                    ))}
                                    {filteredItems.length === 0 && (
                                        <Tr>
                                            <Td colSpan={5} textAlign="center" py={4}>No magazines found.</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </Box>
                    )}
                    {/* Fixed Pagination Controls */}
                    {filteredItems.length > 0 && (
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
                                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length}
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

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Deletion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to delete this magazine? This action cannot be undone.
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="red" onClick={confirmDelete} isLoading={loading}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default EMinthiran;
