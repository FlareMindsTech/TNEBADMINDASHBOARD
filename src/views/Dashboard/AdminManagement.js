
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
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
  Badge,
  Text,
  IconButton,
  Spinner,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaEdit,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
  FaUserSlash,
  FaExclamationTriangle,
  FaImages,
  FaCalendarAlt
} from "react-icons/fa";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { MdAdminPanelSettings, MdPerson, MdBlock, MdWarning } from "react-icons/md";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

// Main Admin Management Component (Renamed internally to EventManagement conceptually, but file name kept)
function AdminManagement() {
  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const iconTeal = useColorModeValue("teal.300", "teal.300");
  const iconBoxInside = useColorModeValue("white", "white");
  const bgButton = useColorModeValue("gray.100", "gray.100");
  const tableHeaderBg = useColorModeValue("gray.100", "gray.700");

  // Custom color theme
  const customColor = "#d70f18";
  const customHoverColor = "#b00c14";

  const toast = useToast();

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // View state - 'list', 'add', 'edit'
  const [currentView, setCurrentView] = useState("list");

  // Form Mode State: 'event' or 'gallery'
  const [formMode, setFormMode] = useState("event");

  // Event Form Data
  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    date: "",
    pdf: null
  });

  // Gallery Form Data
  const [galleryFormData, setGalleryFormData] = useState({
    title: "",
    description: "",
    slug: "",
    caption: "",
    images: [] // Assuming multiple images
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cleaned up unused states to avoid warnings
  // const [adminData, setAdminData] = useState([]);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Placeholder to prevent "getAllAdmins" undefined error if it was here.
    // The previous useEffects fetching admins have been removed/commented out effectively by this rewrite.
  }, []);


  const handleBackToList = () => {
    setCurrentView("list");
    setFormMode("event"); // Reset to default mode
    setError("");
    setSuccess("");
  };

  const handleAddEvent = () => {
    setCurrentView("add");
    setFormMode("event");
    // Reset forms
    setEventFormData({ title: "", description: "", date: "", pdf: null });
    setGalleryFormData({ title: "", description: "", slug: "", caption: "", images: [] });
  };

  const handleSwitchToGallery = () => {
    setFormMode("gallery");
  };

  const handleSwitchToEvent = () => {
    setFormMode("event");
  };

  // Generic Input Handler
  const handleInputChange = (e, formType) => {
    const { name, value, files } = e.target;
    if (formType === 'event') {
        if (name === 'pdf') {
            setEventFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setEventFormData(prev => ({ ...prev, [name]: value }));
        }
    } else {
        if (name === 'images') {
             setGalleryFormData(prev => ({ ...prev, [name]: files }));
        } else {
             setGalleryFormData(prev => ({ ...prev, [name]: value }));
        }
    }
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      // Placeholder submission logic
      if (formMode === 'event') {
          console.log("Submitting Event:", eventFormData);
          toast({ title: "Event Created (UI Only)", status: "success", duration: 3000, isClosable: true });
      } else {
           console.log("Submitting Gallery:", galleryFormData);
           toast({ title: "Gallery Uploaded (UI Only)", status: "success", duration: 3000, isClosable: true });
      }
      handleBackToList();
  }

  // Render Form View
  if (currentView === "add" || currentView === "edit") {
    return (
      <Flex
        flexDirection="column"
        pt={{ base: "120px", md: "75px" }}
        height="100vh"
        overflow="auto"
      >
        <Card bg="white" shadow="xl" height="100%" display="flex" flexDirection="column">
          <CardHeader bg="white" flexShrink={0}>
            <Flex align="center" justify="space-between" mb={4} w="100%">
               <Flex align="center">
                  <Button
                    variant="ghost"
                    leftIcon={<FaArrowLeft />}
                    onClick={handleBackToList}
                    mr={4}
                    color={customColor}
                    _hover={{ bg: `${customColor}10` }}
                  >
                    Back
                  </Button>
                  <Heading size="md" color="gray.700">
                    {formMode === 'event' ? "Create Event" : "Upload Gallery"}
                  </Heading>
               </Flex>
               {/* Toggle Button */}
               {formMode === 'event' && (
                   <Button 
                    bg="gray.100" 
                    color="gray.700" 
                    onClick={handleSwitchToGallery}
                    leftIcon={<FaImages />}
                   >
                       Upload Gallery
                   </Button>
               )}
               {formMode === 'gallery' && (
                   <Button 
                    bg="gray.100" 
                    color="gray.700" 
                    onClick={handleSwitchToEvent}
                    leftIcon={<FaCalendarAlt />}
                   >
                       Create Event
                   </Button>
               )}
            </Flex>
          </CardHeader>
          <CardBody bg="white" flex="1" overflow="auto">
            {/* Event Form */}
            {formMode === 'event' && (
                <Box as="form" onSubmit={handleSubmit}>
                    <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4} mb={4}>
                      <FormControl isRequired>
                        <FormLabel color="gray.700">Title</FormLabel>
                        <Input
                          name="title"
                          placeholder="Event1"
                          value={eventFormData.title}
                          onChange={(e) => handleInputChange(e, 'event')}
                          borderColor={`${customColor}50`}
                          _hover={{ borderColor: customColor }}
                          _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel color="gray.700">Description</FormLabel>
                        <Input
                          name="description"
                          placeholder="Community meeting"
                          value={eventFormData.description}
                          onChange={(e) => handleInputChange(e, 'event')}
                          borderColor={`${customColor}50`}
                          _hover={{ borderColor: customColor }}
                          _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }}
                        />
                         {/* Alternatively use Textarea if preferred */}
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel color="gray.700">Date</FormLabel>
                        <Input
                          type="date"
                          name="date"
                          value={eventFormData.date}
                          onChange={(e) => handleInputChange(e, 'event')}
                          borderColor={`${customColor}50`}
                          _hover={{ borderColor: customColor }}
                          _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel color="gray.700">PDF</FormLabel>
                        <Box
                           border={`1px dashed ${customColor}50`}
                           p={2}
                           borderRadius="md"
                           _hover={{ borderColor: customColor }}
                        >
                            <Input
                            type="file"
                            name="pdf"
                            accept=".pdf"
                            pt={1}
                            variant="unstyled"
                            onChange={(e) => handleInputChange(e, 'event')}
                            />
                        </Box>
                      </FormControl>
                    </SimpleGrid>
                    <Button type="submit" bg={customColor} color="white" _hover={{ bg: customHoverColor }} mt={4} width="100%">
                        Create Event
                    </Button>
                </Box>
            )}

            {/* Gallery Form */}
            {formMode === 'gallery' && (
                <Box as="form" onSubmit={handleSubmit}>
                    <SimpleGrid columns={{ base: 1, md: 1 }} spacing={4} mb={4}>
                      <FormControl isRequired>
                        <FormLabel color="gray.700">Title</FormLabel>
                        <Input
                          name="title"
                          placeholder="Sample Gallery"
                          value={galleryFormData.title}
                          onChange={(e) => handleInputChange(e, 'gallery')}
                          borderColor={`${customColor}50`}
                          _hover={{ borderColor: customColor }}
                          _focus={{ borderColor: customColor, boxShadow: `0 0 0 1px ${customColor}` }}
                        />
                      </FormControl>
                      <FormControl isRequired>
                         <FormLabel color="gray.700">Description</FormLabel>
                         <Input
                          name="description"
                          placeholder="Gallery description"
                          value={galleryFormData.description}
                          onChange={(e) => handleInputChange(e, 'gallery')}
                          borderColor={`${customColor}50`}
                          _hover={{ borderColor: customColor }}
                          _focus={{ borderColor: customColor }}
                         />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel color="gray.700">Slug</FormLabel>
                        <Input
                          name="slug"
                          placeholder="sample-gallery"
                          value={galleryFormData.slug}
                          onChange={(e) => handleInputChange(e, 'gallery')}
                          borderColor={`${customColor}50`}
                          _hover={{ borderColor: customColor }}
                          _focus={{ borderColor: customColor }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel color="gray.700">Caption</FormLabel>
                         <Input
                          name="caption"
                          placeholder="Optional caption"
                          value={galleryFormData.caption}
                          onChange={(e) => handleInputChange(e, 'gallery')}
                          borderColor={`${customColor}50`}
                          _hover={{ borderColor: customColor }}
                          _focus={{ borderColor: customColor }}
                         />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel color="gray.700">Images</FormLabel>
                        <Box
                           border={`1px dashed ${customColor}50`}
                           p={2}
                           borderRadius="md"
                           _hover={{ borderColor: customColor }}
                        >
                            <Input
                            type="file"
                            name="images"
                            accept="image/*"
                            multiple
                            pt={1}
                            variant="unstyled"
                            onChange={(e) => handleInputChange(e, 'gallery')}
                            />
                        </Box>
                      </FormControl>
                    </SimpleGrid>
                    <Button type="submit" bg={customColor} color="white" _hover={{ bg: customHoverColor }} mt={4} width="100%">
                        Upload Gallery
                    </Button>
                </Box>
            )}

          </CardBody>
        </Card>
      </Flex>
    );
  }

  // Helper to render stats (kept from original but with "Admin" references neutralized)
  const renderStats = () => (
      <Flex flexDirection={{ base: "column", md: "row" }} gap={4} mb={4}>
          <Card
            minH="83px"
            cursor="pointer"
            bg="white"
            w={{ base: "32%", md: "30%", lg: "25%" }}
            border={`1px solid ${customColor}30`}
            _hover={{ borderColor: customColor, transform: "translateY(-4px)" }}
            transition="all 0.2s"
          >
            <CardBody>
               <Flex align="center" justify="space-between">
                  <Stat>
                      <StatLabel color="gray.600" fontWeight="bold">Create Events</StatLabel>
                      <StatNumber fontSize="xl">0</StatNumber>
                  </Stat>
                  <IconBox bg={customColor} color="white" h="45px" w="45px">
                      <Icon as={FaUsers} w="24px" h="24px" />
                  </IconBox>
               </Flex>
            </CardBody>
          </Card>
          <Card
            minH="83px"
            cursor="pointer"
            bg="white"
            w={{ base: "32%", md: "30%", lg: "25%" }}
            border={`1px solid ${customColor}30`}
            _hover={{ borderColor: customColor, transform: "translateY(-4px)" }}
            transition="all 0.2s"
          >
             <CardBody>
                <Flex align="center" justify="space-between">
                   <Stat>
                       <StatLabel color="gray.600" fontWeight="bold">Gallery Upload</StatLabel>
                       <StatNumber fontSize="xl">0</StatNumber>
                   </Stat>
                   <IconBox bg={customColor} color="white" h="45px" w="45px">
                        <Icon as={IoCheckmarkDoneCircleSharp} w="24px" h="24px" />
                   </IconBox>
                </Flex>
             </CardBody>
          </Card>
      </Flex>
  );

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
        {renderStats()}
        
      <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="6px 0px 22px 0px">
           <Flex justify="space-between" align="center" w="100%">
              <Text fontSize="xl" color={textColor} fontWeight="bold">
                Events Table
              </Text>
              <Button 
                bg={customColor} 
                color="white" 
                _hover={{ bg: customHoverColor }}
                onClick={handleAddEvent}
              >
                  + Create Event / Gallery
              </Button>
           </Flex>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th color="gray.400">Title</Th>
                <Th color="gray.400">Description</Th>
                <Th color="gray.400">Date/Slug</Th>
                <Th color="gray.400">Type</Th>
              </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td colSpan={4} textAlign="center">No events or galleries yet (UI Demo)</Td>
                </Tr>
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Flex>
  );
}

// Simple Helper for IconBox if it was imported differently in original, but here simulated roughly
const IconBox = ({ children, ...rest }) => (
    <Flex alignItems="center" justifyContent="center" borderRadius="12px" {...rest}>
        {children}
    </Flex>
);

export default AdminManagement;