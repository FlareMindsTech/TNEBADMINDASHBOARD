import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Select,
  SimpleGrid,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Switch,
  Textarea,
  Avatar,
  HStack,
  VStack,
  IconButton,
  Tag,
  TagLabel,
  TagLeftIcon,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import {
  FaUsers,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaPhone,
  FaCalendarAlt,
  FaPlus,
  FaListAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaBuilding,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaSitemap,
  FaSyncAlt,
} from "react-icons/fa";
import { MdOutlineContactPhone } from "react-icons/md";
import {
  getCommitteeMembers,
  createCommitteeMember,
  updateCommitteeMember,
  deleteCommitteeMember,
  getCommitteeTerm,
  updateCommitteeTerm,
  getCommitteeResponsibilities,
  createCommitteeResponsibility,
  updateCommitteeResponsibility,
  deleteCommitteeResponsibility,
  showErrorToast,
} from "views/utils/axiosInstance";

const COMMITTEE_TYPES = [
  {
    key: "CEC",
    name: "CEC Committee",
    fullName: "Central Executive Committee",
    icon: FaBuilding,
    color: "#0A3D91",
    
  },
  {
    key: "EBF",
    name: "EBF Committee",
    fullName: "Engineers' Benevolent Fund",
    icon: FaShieldAlt,
    color: "#1E88E5",
  },
  {
    key: "REGIONAL",
    name: "Regional Secretary",
    fullName: "Regional Secretaries & Representatives",
    icon: FaMapMarkerAlt,
    color: "#7B1FA2",
  },
  {
    key: "BRANCH",
    name: "Branch Secretary",
    fullName: "Branch Secretaries",
    icon: FaSitemap,
    color: "#2E7D32",
  },
];

function Committees() {
  const textColor = useColorModeValue("gray.700", "white");
  const cardBg = useColorModeValue("white", "gray.700");
  const theadBg = useColorModeValue("gray.100", "gray.800");
  const tableBorder = useColorModeValue("gray.200", "gray.600");
  const primaryColor = "#0A3D91";
  const hoverColor = "#1E88E5";
  const toast = useToast();

  // Active Committee Type: "CEC" | "EBF" | "REGIONAL" | "BRANCH"
  const [committeeType, setCommitteeType] = useState("CEC");

  // Tab Index: 0 -> Members, 1 -> Term & Election, 2 -> Responsibilities
  const [tabIndex, setTabIndex] = useState(0);

  // =========================================================
  // 1. MEMBERS STATE
  // =========================================================
  const [membersLoading, setMembersLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [memberFilterStatus, setMemberFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25); // Default 25 for great scrolling UX

  // Member Modal
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isSavingMember, setIsSavingMember] = useState(false);
  const [memberFormData, setMemberFormData] = useState({
    name: "",
    post: "",
    designation: "",
    branch: "",
    region: "",
    phone: "",
    displayOrder: 0,
    isActive: true,
    isQueryContact: false,
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);

  // Member Delete Modal
  const [isDeleteMemberModalOpen, setIsDeleteMemberModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeletingMember, setIsDeletingMember] = useState(false);

  // =========================================================
  // 2. TERM DETAILS STATE
  // =========================================================
  const [termLoading, setTermLoading] = useState(false);
  const [termData, setTermData] = useState({
    currentTerm: "",
    electedDate: "",
    nextElectionDate: "",
    totalMembers: 0,
  });
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [termFormData, setTermFormData] = useState({
    currentTerm: "",
    electedDate: "",
    nextElectionDate: "",
  });
  const [isSavingTerm, setIsSavingTerm] = useState(false);

  // =========================================================
  // 3. RESPONSIBILITIES STATE
  // =========================================================
  const [respLoading, setRespLoading] = useState(false);
  const [responsibilities, setResponsibilities] = useState([]);
  const [isRespModalOpen, setIsRespModalOpen] = useState(false);
  const [editingResp, setEditingResp] = useState(null);
  const [isSavingResp, setIsSavingResp] = useState(false);
  const [respFormData, setRespFormData] = useState({
    title: "",
    description: "",
    displayOrder: 0,
    isActive: true,
  });

  // Responsibility Delete Modal
  const [isDeleteRespModalOpen, setIsDeleteRespModalOpen] = useState(false);
  const [respToDelete, setRespToDelete] = useState(null);
  const [isDeletingResp, setIsDeletingResp] = useState(false);

  // Active committee metadata
  const currentCommitteeMeta = COMMITTEE_TYPES.find((c) => c.key === committeeType) || COMMITTEE_TYPES[0];

  // =========================================================
  // FETCH DATA ON MOUNT & COMMITTEE TYPE CHANGE
  // =========================================================
  const refreshAllData = () => {
    fetchMembers();
    fetchTerm();
    fetchResponsibilities();
  };

  useEffect(() => {
    refreshAllData();
    setCurrentPage(1);
    setMemberSearch("");
    setMemberFilterStatus("all");
  }, [committeeType]);

  // Fetch Members
  const fetchMembers = async () => {
    setMembersLoading(true);
    try {
      const data = await getCommitteeMembers(committeeType);
      const list = Array.isArray(data) ? data : data.members || [];
      setMembers(list);
    } catch (error) {
      showErrorToast(toast, error, { title: `Failed to load ${committeeType} members` });
    } finally {
      setMembersLoading(false);
    }
  };

  // Fetch Term
  const fetchTerm = async () => {
    setTermLoading(true);
    try {
      const data = await getCommitteeTerm(committeeType);
      setTermData({
        currentTerm: data.currentTerm || "",
        electedDate: data.electedDate || "",
        nextElectionDate: data.nextElectionDate || "",
        totalMembers: data.totalMembers || 0,
      });
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to load term details" });
    } finally {
      setTermLoading(false);
    }
  };

  // Fetch Responsibilities
  const fetchResponsibilities = async () => {
    setRespLoading(true);
    try {
      const data = await getCommitteeResponsibilities(committeeType);
      setResponsibilities(Array.isArray(data) ? data : []);
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to load responsibilities" });
    } finally {
      setRespLoading(false);
    }
  };

  // =========================================================
  // MEMBER HANDLERS
  // =========================================================
  const handleOpenAddMember = () => {
    setEditingMember(null);
    let defaultPost = "";
    if (committeeType === "REGIONAL") defaultPost = "Regional Secretary";
    if (committeeType === "BRANCH") defaultPost = "Branch Secretary";

    setMemberFormData({
      name: "",
      post: defaultPost,
      designation: "",
      branch: "",
      region: "",
      phone: "",
      displayOrder: members.length + 1,
      isActive: true,
      isQueryContact: false,
      photo: null,
    });
    setPhotoPreview("");
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member) => {
    setEditingMember(member);
    setMemberFormData({
      name: member.name || "",
      post: member.post || "",
      designation: member.designation || "",
      branch: member.branch || "",
      region: member.region || "",
      phone: member.phone || "",
      displayOrder: member.displayOrder !== undefined ? member.displayOrder : 0,
      isActive: member.isActive !== undefined ? member.isActive : true,
      isQueryContact: member.isQueryContact || false,
      photo: null,
    });
    setPhotoPreview(member.photo || "");
    setIsMemberModalOpen(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMemberFormData((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!memberFormData.name.trim() || !memberFormData.post.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and Post / Position are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSavingMember(true);
    try {
      const fd = new FormData();
      fd.append("name", memberFormData.name.trim());
      fd.append("post", memberFormData.post.trim());
      fd.append("designation", memberFormData.designation.trim());
      fd.append("branch", memberFormData.branch.trim());
      fd.append("region", memberFormData.region.trim());
      fd.append("phone", memberFormData.phone.trim());
      fd.append("displayOrder", memberFormData.displayOrder);
      fd.append("isActive", memberFormData.isActive);
      fd.append("isQueryContact", memberFormData.isQueryContact);

      if (memberFormData.photo) {
        fd.append("photo", memberFormData.photo);
      }

      if (editingMember) {
        await updateCommitteeMember(committeeType, editingMember._id, fd);
        toast({
          title: "Member Updated",
          description: `${memberFormData.name} has been updated successfully.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createCommitteeMember(committeeType, fd);
        toast({
          title: "Member Created",
          description: `${memberFormData.name} added to ${currentCommitteeMeta.name}.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      setIsMemberModalOpen(false);
      fetchMembers();
      fetchTerm();
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to save member" });
    } finally {
      setIsSavingMember(false);
    }
  };

  const handleOpenDeleteMember = (member) => {
    setMemberToDelete(member);
    setIsDeleteMemberModalOpen(true);
  };

  const handleConfirmDeleteMember = async () => {
    if (!memberToDelete) return;
    setIsDeletingMember(true);
    try {
      await deleteCommitteeMember(committeeType, memberToDelete._id);
      toast({
        title: "Member Deleted",
        description: `${memberToDelete.name} has been removed.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteMemberModalOpen(false);
      setMemberToDelete(null);
      fetchMembers();
      fetchTerm();
    } catch (error) {
      showErrorToast(toast, error, { title: "Delete Failed" });
    } finally {
      setIsDeletingMember(false);
    }
  };

  // =========================================================
  // TERM HANDLERS
  // =========================================================
  const handleOpenEditTerm = () => {
    setTermFormData({
      currentTerm: termData.currentTerm || "",
      electedDate: termData.electedDate || "",
      nextElectionDate: termData.nextElectionDate || "",
    });
    setIsTermModalOpen(true);
  };

  const handleSaveTerm = async (e) => {
    e.preventDefault();
    setIsSavingTerm(true);
    try {
      const updated = await updateCommitteeTerm(committeeType, termFormData);
      setTermData((prev) => ({
        ...prev,
        currentTerm: updated.currentTerm,
        electedDate: updated.electedDate,
        nextElectionDate: updated.nextElectionDate,
        totalMembers: updated.totalMembers,
      }));
      toast({
        title: "Term Details Updated",
        description: `${currentCommitteeMeta.name} term details successfully updated.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsTermModalOpen(false);
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to update term" });
    } finally {
      setIsSavingTerm(false);
    }
  };

  // =========================================================
  // RESPONSIBILITY HANDLERS
  // =========================================================
  const handleOpenAddResp = () => {
    setEditingResp(null);
    setRespFormData({
      title: "",
      description: "",
      displayOrder: responsibilities.length + 1,
      isActive: true,
    });
    setIsRespModalOpen(true);
  };

  const handleOpenEditResp = (resp) => {
    setEditingResp(resp);
    setRespFormData({
      title: resp.title || "",
      description: resp.description || "",
      displayOrder: resp.displayOrder !== undefined ? resp.displayOrder : 0,
      isActive: resp.isActive !== undefined ? resp.isActive : true,
    });
    setIsRespModalOpen(true);
  };

  const handleSaveResp = async (e) => {
    e.preventDefault();
    if (!respFormData.title.trim() || !respFormData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and description are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSavingResp(true);
    try {
      if (editingResp) {
        await updateCommitteeResponsibility(committeeType, editingResp._id, respFormData);
        toast({
          title: "Responsibility Updated",
          description: "Responsibility updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await createCommitteeResponsibility(committeeType, respFormData);
        toast({
          title: "Responsibility Created",
          description: "New responsibility created successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsRespModalOpen(false);
      fetchResponsibilities();
    } catch (error) {
      showErrorToast(toast, error, { title: "Failed to save responsibility" });
    } finally {
      setIsSavingResp(false);
    }
  };

  const handleOpenDeleteResp = (resp) => {
    setRespToDelete(resp);
    setIsDeleteRespModalOpen(true);
  };

  const handleConfirmDeleteResp = async () => {
    if (!respToDelete) return;
    setIsDeletingResp(true);
    try {
      await deleteCommitteeResponsibility(committeeType, respToDelete._id);
      toast({
        title: "Responsibility Deleted",
        description: "Responsibility deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteRespModalOpen(false);
      setRespToDelete(null);
      fetchResponsibilities();
    } catch (error) {
      showErrorToast(toast, error, { title: "Delete Failed" });
    } finally {
      setIsDeletingResp(false);
    }
  };

  // =========================================================
  // FILTERED & PAGINATED MEMBERS
  // =========================================================
  const filteredMembers = members.filter((member) => {
    const searchLower = memberSearch.toLowerCase();
    const matchesSearch =
      (member.name && member.name.toLowerCase().includes(searchLower)) ||
      (member.post && member.post.toLowerCase().includes(searchLower)) ||
      (member.designation && member.designation.toLowerCase().includes(searchLower)) ||
      (member.branch && member.branch.toLowerCase().includes(searchLower)) ||
      (member.region && member.region.toLowerCase().includes(searchLower)) ||
      (member.phone && member.phone.toLowerCase().includes(searchLower));

    const matchesStatus =
      memberFilterStatus === "all"
        ? true
        : memberFilterStatus === "active"
        ? member.isActive === true
        : member.isActive === false;

    return matchesSearch && matchesStatus;
  });

  const totalMemberPages = itemsPerPage >= 9999 ? 1 : Math.ceil(filteredMembers.length / itemsPerPage) || 1;
  const paginatedMembers = itemsPerPage >= 9999
    ? filteredMembers
    : filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const activeMembersCount = members.filter((m) => m.isActive).length;
  const queryContactsCount = members.filter((m) => m.isQueryContact).length;

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }} gap="24px">
      {/* 1. TOP HEADER & 4-WING SELECTOR */}
      <Card bg={cardBg} p="20px" boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)" borderRadius="15px">
        <Flex
          direction={{ base: "column", lg: "row" }}
          justify="space-between"
          align={{ base: "flex-start", lg: "center" }}
          gap="20px"
        >
          <Box flexShrink={0}>
            <HStack spacing="10px">
              <Icon as={FaUsers} w="26px" h="26px" color={primaryColor} />
              <Heading as="h2" size="lg" color={textColor} fontWeight="bold">
                Committee Management
              </Heading>
            </HStack>
          </Box>

          {/* Committee Switcher */}
          <HStack
            spacing={{ base: "6px", md: "8px" }}
            flexWrap="nowrap"
            overflowX="auto"
            maxW="100%"
            py="2px"
            sx={{
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {COMMITTEE_TYPES.map((type) => {
              const isSelected = committeeType === type.key;
              return (
                <Button
                  key={type.key}
                  size="sm"
                  h="38px"
                  flexShrink={0}
                  whiteSpace="nowrap"
                  borderRadius="10px"
                  bg={isSelected ? primaryColor : useColorModeValue("gray.100", "gray.800")}
                  color={isSelected ? "white" : textColor}
                  _hover={{ bg: isSelected ? hoverColor : useColorModeValue("gray.200", "gray.700") }}
                  onClick={() => setCommitteeType(type.key)}
                  leftIcon={<Icon as={type.icon} />}
                  px={{ base: "10px", md: "14px" }}
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="bold"
                  boxShadow={isSelected ? "0 2px 8px rgba(10, 61, 145, 0.25)" : "none"}
                >
                  {type.name}
                </Button>
              );
            })}
          </HStack>
        </Flex>
      </Card>

      {/* 2. STATS OVERVIEW CARDS */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={{ base: "12px", md: "14px" }}>
        {/* Total Members */}
        <Card bg={cardBg} p="12px 16px" borderRadius="12px" boxShadow="0 2px 8px rgba(0,0,0,0.04)">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="11px" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="0.3px">
                Total {currentCommitteeMeta.name}
              </Text>
              <Heading size="md" color={textColor} mt="2px">
                {members.length}
              </Heading>
            </Box>
            <Flex
              w="38px"
              h="38px"
              align="center"
              justify="center"
              borderRadius="10px"
              bg="blue.50"
              color={primaryColor}
            >
              <Icon as={currentCommitteeMeta.icon} w="18px" h="18px" />
            </Flex>
          </Flex>
        </Card>

        {/* Active Members */}
        <Card bg={cardBg} p="12px 16px" borderRadius="12px" boxShadow="0 2px 8px rgba(0,0,0,0.04)">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="11px" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="0.3px">
                Active Members
              </Text>
              <Heading size="md" color="green.500" mt="2px">
                {activeMembersCount}
              </Heading>
            </Box>
            <Flex
              w="38px"
              h="38px"
              align="center"
              justify="center"
              borderRadius="10px"
              bg="green.50"
              color="green.500"
            >
              <Icon as={FaCheckCircle} w="18px" h="18px" />
            </Flex>
          </Flex>
        </Card>

        {/* Query Support Contacts */}
        <Card bg={cardBg} p="12px 16px" borderRadius="12px" boxShadow="0 2px 8px rgba(0,0,0,0.04)">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="11px" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="0.3px">
                Query Contacts
              </Text>
              <Heading size="md" color="purple.500" mt="2px">
                {queryContactsCount}
              </Heading>
            </Box>
            <Flex
              w="38px"
              h="38px"
              align="center"
              justify="center"
              borderRadius="10px"
              bg="purple.50"
              color="purple.500"
            >
              <Icon as={MdOutlineContactPhone} w="20px" h="20px" />
            </Flex>
          </Flex>
        </Card>

        {/* Current Term */}
        <Card bg={cardBg} p="12px 16px" borderRadius="12px" boxShadow="0 2px 8px rgba(0,0,0,0.04)">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="11px" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="0.3px">
                Current Term
              </Text>
              <Text fontSize="sm" fontWeight="bold" color={textColor} mt="2px" noOfLines={1}>
                {termData.currentTerm || "Not specified"}
              </Text>
            </Box>
            <Flex
              w="38px"
              h="38px"
              align="center"
              justify="center"
              borderRadius="10px"
              bg="orange.50"
              color="orange.500"
            >
              <Icon as={FaCalendarAlt} w="18px" h="18px" />
            </Flex>
          </Flex>
        </Card>
      </SimpleGrid>

      {/* 3. MAIN SECTION TABS */}
      <Card bg={cardBg} p={{ base: "14px", md: "16px" }} borderRadius="14px" boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)">
        <Tabs
          variant="enclosed"
          colorScheme="blue"
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
        >
          <Flex justify="space-between" align={{ base: "stretch", md: "center" }} direction={{ base: "column", md: "row" }} mb="14px" gap="10px">
            <TabList borderBottom="2px solid" borderColor={tableBorder} mb="0" flexWrap="wrap">
              <Tab py="6px" px="12px" fontSize="13px" fontWeight="bold" _selected={{ color: primaryColor, borderColor: primaryColor, borderBottom: "none", bg: useColorModeValue("blue.50", "gray.800") }}>
                <HStack spacing="6px">
                  <Icon as={FaUsers} w="14px" h="14px" />
                  <Text>Members Directory ({members.length})</Text>
                </HStack>
              </Tab>
              <Tab py="6px" px="12px" fontSize="13px" fontWeight="bold" _selected={{ color: primaryColor, borderColor: primaryColor, borderBottom: "none", bg: useColorModeValue("blue.50", "gray.800") }}>
                <HStack spacing="6px">
                  <Icon as={FaCalendarAlt} w="14px" h="14px" />
                  <Text>Term & Election Details</Text>
                </HStack>
              </Tab>
              <Tab py="6px" px="12px" fontSize="13px" fontWeight="bold" _selected={{ color: primaryColor, borderColor: primaryColor, borderBottom: "none", bg: useColorModeValue("blue.50", "gray.800") }}>
                <HStack spacing="6px">
                  <Icon as={FaListAlt} w="14px" h="14px" />
                  <Text>Responsibilities & Roles ({responsibilities.length})</Text>
                </HStack>
              </Tab>
            </TabList>

            {/* Quick Refresh Button */}
            <Button
              size="xs"
              h="30px"
              px="10px"
              fontSize="12px"
              variant="outline"
              colorScheme="blue"
              leftIcon={<Icon as={FaSyncAlt} className={membersLoading ? "fa-spin" : ""} />}
              onClick={refreshAllData}
              isLoading={membersLoading || termLoading || respLoading}
              borderRadius="8px"
              alignSelf={{ base: "flex-end", md: "center" }}
            >
              Refresh Data
            </Button>
          </Flex>

          <TabPanels>
            {/* =========================================================
                TAB 1: MEMBERS DIRECTORY
               ========================================================= */}
            <TabPanel p="0">
              {/* Search & Action Bar */}
              <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "stretch", md: "center" }}
                mb="14px"
                gap="10px"
              >
                <HStack spacing="8px" flex="1" maxW={{ base: "100%", md: "600px" }} flexWrap={{ base: "wrap", sm: "nowrap" }}>
                  <Input
                    size="sm"
                    h="34px"
                    fontSize="13px"
                    placeholder="Search by name, post, branch, region, phone..."
                    value={memberSearch}
                    onChange={(e) => {
                      setMemberSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    borderRadius="8px"
                    bg={useColorModeValue("white", "gray.800")}
                  />
                  <Select
                    size="sm"
                    h="34px"
                    fontSize="13px"
                    w={{ base: "100%", sm: "130px" }}
                    borderRadius="8px"
                    value={memberFilterStatus}
                    onChange={(e) => {
                      setMemberFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    bg={useColorModeValue("white", "gray.800")}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </Select>

                  <Select
                    size="sm"
                    h="34px"
                    fontSize="13px"
                    w={{ base: "100%", sm: "115px" }}
                    borderRadius="8px"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    bg={useColorModeValue("white", "gray.800")}
                  >
                    <option value={10}>10 / page</option>
                    <option value={25}>25 / page</option>
                    <option value={50}>50 / page</option>
                    <option value={100}>100 / page</option>
                    <option value={9999}>View All</option>
                  </Select>
                </HStack>

                <Button
                  size="sm"
                  h="34px"
                  fontSize="13px"
                  bg={primaryColor}
                  color="white"
                  _hover={{ bg: hoverColor }}
                  leftIcon={<Icon as={FaUserPlus} />}
                  onClick={handleOpenAddMember}
                  borderRadius="8px"
                  px="14px"
                  flexShrink={0}
                >
                  Add Member
                </Button>
              </Flex>

              {/* Scrollable Members Table */}
              {membersLoading ? (
                <Flex justify="center" align="center" minH="250px">
                  <Spinner size="lg" color={primaryColor} />
                </Flex>
              ) : filteredMembers.length === 0 ? (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  py="40px"
                  border="2px dashed"
                  borderColor={tableBorder}
                  borderRadius="10px"
                >
                  <Icon as={FaUsers} w="36px" h="36px" color="gray.400" mb="10px" />
                  <Text fontSize="md" fontWeight="semibold" color={textColor}>
                    No {currentCommitteeMeta.name} members found
                  </Text>
                  <Text color="gray.500" fontSize="xs" mt="2px">
                    Try adjusting your search criteria or add a new member.
                  </Text>
                </Flex>
              ) : (
                <Box
                  maxH="560px"
                  overflowY="auto"
                  overflowX="auto"
                  borderRadius="10px"
                  border="1px solid"
                  borderColor={tableBorder}
                  css={{
                    "&::-webkit-scrollbar": { width: "6px", height: "6px" },
                    "&::-webkit-scrollbar-track": { background: "rgba(0, 0, 0, 0.05)" },
                    "&::-webkit-scrollbar-thumb": { background: "rgba(10, 61, 145, 0.4)", borderRadius: "6px" },
                  }}
                >
                  <Table variant="simple" colorScheme="gray" size="sm">
                    <Thead
                      position="sticky"
                      top="0"
                      zIndex="2"
                      bg={theadBg}
                      boxShadow="0 2px 4px rgba(0, 0, 0, 0.06)"
                    >
                      <Tr>
                        <Th py="8px" px="10px" fontSize="11px" width="55px" bg={theadBg}>Order</Th>
                        <Th py="8px" px="10px" fontSize="11px" bg={theadBg}>Member</Th>
                        <Th py="8px" px="10px" fontSize="11px" bg={theadBg}>Post / Position</Th>
                        <Th py="8px" px="10px" fontSize="11px" bg={theadBg}>Designation</Th>
                        <Th py="8px" px="10px" fontSize="11px" bg={theadBg}>{committeeType === "REGIONAL" ? "Region" : committeeType === "BRANCH" ? "Branch" : "Region / Branch"}</Th>
                        <Th py="8px" px="10px" fontSize="11px" bg={theadBg}>Contact</Th>
                        <Th py="8px" px="10px" fontSize="11px" textAlign="center" bg={theadBg}>Query Contact</Th>
                        <Th py="8px" px="10px" fontSize="11px" textAlign="center" bg={theadBg}>Status</Th>
                        <Th py="8px" px="10px" fontSize="11px" textAlign="right" bg={theadBg}>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paginatedMembers.map((member) => (
                        <Tr key={member._id} _hover={{ bg: useColorModeValue("gray.50", "gray.800") }}>
                          <Td py="8px" px="10px" fontWeight="bold" color="gray.500" fontSize="xs">
                            #{member.displayOrder || 0}
                          </Td>
                          <Td py="8px" px="10px">
                            <HStack spacing="10px">
                              <Avatar
                                size="sm"
                                name={member.name}
                                src={member.photo}
                                borderRadius="8px"
                                border="2px solid"
                                borderColor={primaryColor}
                              />
                              <Box>
                                <Text fontWeight="bold" fontSize="xs" color={textColor}>
                                  {member.name}
                                </Text>
                                {member.isQueryContact && (
                                  <Badge colorScheme="purple" fontSize="9px" px="4px" borderRadius="3px">
                                    Official Contact
                                  </Badge>
                                )}
                              </Box>
                            </HStack>
                          </Td>
                          <Td py="8px" px="10px">
                            <Badge
                              bg="blue.50"
                              color={primaryColor}
                              px="8px"
                              py="2px"
                              borderRadius="6px"
                              fontWeight="bold"
                              fontSize="xs"
                            >
                              {member.post}
                            </Badge>
                          </Td>
                          <Td py="8px" px="10px" maxW="200px">
                            <Text fontSize="xs" fontWeight="medium" color={textColor} noOfLines={2}>
                              {member.designation || "-"}
                            </Text>
                          </Td>
                          <Td py="8px" px="10px" maxW="180px">
                            {member.region && (
                              <Text fontSize="xs" fontWeight="bold" color="blue.600" noOfLines={1}>
                                📍 {member.region}
                              </Text>
                            )}
                            {member.branch && (
                              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                🏢 {member.branch}
                              </Text>
                            )}
                            {!member.region && !member.branch && (
                              <Text fontSize="xs" color="gray.400">-</Text>
                            )}
                          </Td>
                          <Td py="8px" px="10px">
                            {member.phone ? (
                              <HStack spacing="4px">
                                <Icon as={FaPhone} color="green.500" w="11px" h="11px" />
                                <Text fontSize="xs" fontWeight="medium">
                                  {member.phone}
                                </Text>
                              </HStack>
                            ) : (
                              <Text fontSize="xs" color="gray.400">
                                None
                              </Text>
                            )}
                          </Td>
                          <Td py="8px" px="10px" textAlign="center">
                            {member.isQueryContact ? (
                              <Tag size="sm" colorScheme="purple" borderRadius="full" px="6px" py="1px" fontSize="10px">
                                <TagLeftIcon as={MdOutlineContactPhone} boxSize="10px" />
                                <TagLabel>Yes</TagLabel>
                              </Tag>
                            ) : (
                              <Text fontSize="xs" color="gray.400">
                                No
                              </Text>
                            )}
                          </Td>
                          <Td py="8px" px="10px" textAlign="center">
                            <Badge
                              colorScheme={member.isActive ? "green" : "red"}
                              borderRadius="6px"
                              px="6px"
                              py="2px"
                              fontSize="10px"
                            >
                              {member.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </Td>
                          <Td py="8px" px="10px" textAlign="right">
                            <HStack spacing="6px" justify="flex-end">
                              <IconButton
                                size="xs"
                                aria-label="Edit member"
                                icon={<FaEdit />}
                                colorScheme="blue"
                                variant="outline"
                                onClick={() => handleOpenEditMember(member)}
                              />
                              <IconButton
                                size="xs"
                                aria-label="Delete member"
                                icon={<FaTrash />}
                                colorScheme="red"
                                variant="outline"
                                onClick={() => handleOpenDeleteMember(member)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}

              {/* Pagination controls */}
              {totalMemberPages > 1 && (
                <Flex justify="space-between" align="center" mt="20px" pt="10px">
                  <Text fontSize="sm" color="gray.500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of{" "}
                    {filteredMembers.length} members
                  </Text>
                  <HStack spacing="6px">
                    <IconButton
                      size="sm"
                      aria-label="Previous Page"
                      icon={<FaChevronLeft />}
                      isDisabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    />
                    <Text fontSize="sm" fontWeight="bold" px="10px">
                      {currentPage} / {totalMemberPages}
                    </Text>
                    <IconButton
                      size="sm"
                      aria-label="Next Page"
                      icon={<FaChevronRight />}
                      isDisabled={currentPage === totalMemberPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalMemberPages))}
                    />
                  </HStack>
                </Flex>
              )}
            </TabPanel>

            {/* =========================================================
                TAB 2: TERM & ELECTION DETAILS
               ========================================================= */}
            <TabPanel p="0">
              {termLoading ? (
                <Flex justify="center" align="center" minH="200px">
                  <Spinner size="xl" color={primaryColor} />
                </Flex>
              ) : (
                <Box maxW="800px" mx="auto" py="10px">
                  <Card
                    bg={useColorModeValue("gray.50", "gray.800")}
                    p="24px"
                    borderRadius="16px"
                    border="1px solid"
                    borderColor={tableBorder}
                  >
                    <Flex justify="space-between" align="center" mb="20px">
                      <Box>
                        <Heading size="md" color={textColor}>
                          {currentCommitteeMeta.fullName} Term
                        </Heading>
                        <Text fontSize="sm" color="gray.500" mt="2px">
                          Current office term dates and election schedules
                        </Text>
                      </Box>
                      <Button
                        size="sm"
                        bg={primaryColor}
                        color="white"
                        _hover={{ bg: hoverColor }}
                        leftIcon={<Icon as={FaEdit} />}
                        onClick={handleOpenEditTerm}
                        borderRadius="8px"
                      >
                        Edit Term
                      </Button>
                    </Flex>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
                      <Box p="16px" bg={cardBg} borderRadius="12px" border="1px solid" borderColor={tableBorder}>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                          Current Term
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color={textColor} mt="4px">
                          {termData.currentTerm || "Not set"}
                        </Text>
                      </Box>

                      <Box p="16px" bg={cardBg} borderRadius="12px" border="1px solid" borderColor={tableBorder}>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                          Total Active Members
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="green.500" mt="4px">
                          {termData.totalMembers || activeMembersCount} Active Members
                        </Text>
                      </Box>

                      <Box p="16px" bg={cardBg} borderRadius="12px" border="1px solid" borderColor={tableBorder}>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                          Elected Date
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color={textColor} mt="4px">
                          {termData.electedDate || "Not set"}
                        </Text>
                      </Box>

                      <Box p="16px" bg={cardBg} borderRadius="12px" border="1px solid" borderColor={tableBorder}>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase">
                          Next Election Date
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="purple.600" mt="4px">
                          {termData.nextElectionDate || "Not set"}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </Card>
                </Box>
              )}
            </TabPanel>

            {/* =========================================================
                TAB 3: RESPONSIBILITIES & ROLES
               ========================================================= */}
            <TabPanel p="0">
              <Flex justify="space-between" align="center" mb="20px">
                <Box>
                  <Heading size="md" color={textColor}>
                    {currentCommitteeMeta.name} Key Responsibilities & Functions
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    Define and display the core objectives and responsibilities of this committee
                  </Text>
                </Box>
                <Button
                  bg={primaryColor}
                  color="white"
                  _hover={{ bg: hoverColor }}
                  leftIcon={<Icon as={FaPlus} />}
                  onClick={handleOpenAddResp}
                  borderRadius="10px"
                >
                  Add Responsibility
                </Button>
              </Flex>

              {/* Scrollable Responsibilities Table */}
              {respLoading ? (
                <Flex justify="center" align="center" minH="200px">
                  <Spinner size="xl" color={primaryColor} />
                </Flex>
              ) : responsibilities.length === 0 ? (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  py="50px"
                  border="2px dashed"
                  borderColor={tableBorder}
                  borderRadius="12px"
                >
                  <Icon as={FaListAlt} w="40px" h="40px" color="gray.400" mb="12px" />
                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                    No responsibilities configured
                  </Text>
                  <Text color="gray.500" fontSize="sm" mt="4px">
                    Click "Add Responsibility" to publish duties for this committee.
                  </Text>
                </Flex>
              ) : (
                <Box
                  maxH="480px"
                  overflowY="auto"
                  overflowX="auto"
                  borderRadius="12px"
                  border="1px solid"
                  borderColor={tableBorder}
                  css={{
                    "&::-webkit-scrollbar": { width: "6px", height: "6px" },
                    "&::-webkit-scrollbar-track": { background: "rgba(0, 0, 0, 0.05)" },
                    "&::-webkit-scrollbar-thumb": { background: "rgba(10, 61, 145, 0.4)", borderRadius: "6px" },
                  }}
                >
                  <Table variant="simple">
                    <Thead
                      position="sticky"
                      top="0"
                      zIndex="2"
                      bg={theadBg}
                      boxShadow="0 2px 4px rgba(0, 0, 0, 0.06)"
                    >
                      <Tr>
                        <Th width="70px" bg={theadBg}>Order</Th>
                        <Th width="250px" bg={theadBg}>Title</Th>
                        <Th bg={theadBg}>Description</Th>
                        <Th width="100px" textAlign="center" bg={theadBg}>
                          Status
                        </Th>
                        <Th width="120px" textAlign="right" bg={theadBg}>
                          Actions
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {responsibilities.map((resp) => (
                        <Tr key={resp._id} _hover={{ bg: useColorModeValue("gray.50", "gray.800") }}>
                          <Td fontWeight="bold" color="gray.500">
                            #{resp.displayOrder || 0}
                          </Td>
                          <Td fontWeight="bold" color={textColor}>
                            {resp.title}
                          </Td>
                          <Td fontSize="sm" color="gray.600" whiteSpace="pre-wrap">
                            {resp.description}
                          </Td>
                          <Td textAlign="center">
                            <Badge
                              colorScheme={resp.isActive ? "green" : "red"}
                              borderRadius="6px"
                              px="8px"
                              py="3px"
                            >
                              {resp.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </Td>
                          <Td textAlign="right">
                            <HStack spacing="8px" justify="flex-end">
                              <IconButton
                                size="sm"
                                aria-label="Edit responsibility"
                                icon={<FaEdit />}
                                colorScheme="blue"
                                variant="outline"
                                onClick={() => handleOpenEditResp(resp)}
                              />
                              <IconButton
                                size="sm"
                                aria-label="Delete responsibility"
                                icon={<FaTrash />}
                                colorScheme="red"
                                variant="outline"
                                onClick={() => handleOpenDeleteResp(resp)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>

      {/* =========================================================
          MODAL 1: ADD / EDIT MEMBER MODAL
         ========================================================= */}
      <Modal isOpen={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent borderRadius="16px">
          <ModalHeader bg={primaryColor} color="white" borderTopRadius="16px">
            {editingMember
              ? `Edit ${currentCommitteeMeta.name} Member`
              : `Add New ${currentCommitteeMeta.name} Member`}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <form onSubmit={handleSaveMember}>
            <ModalBody py="20px">
              <VStack spacing="16px" align="stretch">
                {/* Photo Upload & Preview */}
                <Flex align="center" gap="20px" bg={useColorModeValue("gray.50", "gray.800")} p="14px" borderRadius="12px">
                  <Avatar
                    size="xl"
                    name={memberFormData.name || "Member"}
                    src={photoPreview}
                    borderRadius="12px"
                    border="2px solid"
                    borderColor={primaryColor}
                  />
                  <Box>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      Member Photo
                    </FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      display="none"
                    />
                    <Button
                      size="sm"
                      bg={primaryColor}
                      color="white"
                      _hover={{ bg: hoverColor }}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      {photoPreview ? "Change Photo" : "Upload Photo"}
                    </Button>
                    <Text fontSize="xs" color="gray.500" mt="4px">
                      JPG, PNG or WEBP. Max 5MB.
                    </Text>
                  </Box>
                </Flex>

                {/* Name & Post */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing="14px">
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Full Name (with Prefix)</FormLabel>
                    <Input
                      placeholder="e.g. Er. N. SENTHILKUMAR"
                      value={memberFormData.name}
                      onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Post / Position</FormLabel>
                    <Input
                      placeholder={
                        committeeType === "REGIONAL"
                          ? "Regional Secretary"
                          : committeeType === "BRANCH"
                          ? "Branch Secretary"
                          : "e.g. President, General Secretary, Treasurer"
                      }
                      value={memberFormData.post}
                      onChange={(e) => setMemberFormData({ ...memberFormData, post: e.target.value })}
                    />
                  </FormControl>
                </SimpleGrid>

                {/* Designation */}
                <FormControl>
                  <FormLabel fontSize="sm">Designation</FormLabel>
                  <Input
                    placeholder="e.g. EE / Master Plan / Transmission or SE / DISTRIBUTION"
                    value={memberFormData.designation}
                    onChange={(e) => setMemberFormData({ ...memberFormData, designation: e.target.value })}
                  />
                </FormControl>

                {/* Region & Branch */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing="14px">
                  <FormControl>
                    <FormLabel fontSize="sm">
                      Region {committeeType === "REGIONAL" && <Text as="span" color="red.500">*</Text>}
                    </FormLabel>
                    <Input
                      placeholder="e.g. CHENNAI HQRS, COIMBATORE, MADURAI"
                      value={memberFormData.region}
                      onChange={(e) => setMemberFormData({ ...memberFormData, region: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">
                      Branch / Office Location {committeeType === "BRANCH" && <Text as="span" color="red.500">*</Text>}
                    </FormLabel>
                    <Input
                      placeholder="e.g. BASIN BRIDGE, CHENNAI/CENTRAL, METTUR EDC"
                      value={memberFormData.branch}
                      onChange={(e) => setMemberFormData({ ...memberFormData, branch: e.target.value })}
                    />
                  </FormControl>
                </SimpleGrid>

                {/* Phone & Display Order */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing="14px">
                  <FormControl>
                    <FormLabel fontSize="sm">Contact Phone</FormLabel>
                    <Input
                      placeholder="e.g. 94980 38894 / 94458 50769"
                      value={memberFormData.phone}
                      onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Display Order Priority</FormLabel>
                    <Input
                      type="number"
                      placeholder="1"
                      value={memberFormData.displayOrder}
                      onChange={(e) => setMemberFormData({ ...memberFormData, displayOrder: e.target.value })}
                    />
                  </FormControl>
                </SimpleGrid>

                {/* Toggles */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing="14px" pt="6px">
                  <FormControl display="flex" alignItems="center">
                    <Switch
                      id="is-active"
                      isChecked={memberFormData.isActive}
                      colorScheme="green"
                      onChange={(e) => setMemberFormData({ ...memberFormData, isActive: e.target.checked })}
                      mr="10px"
                    />
                    <FormLabel htmlFor="is-active" mb="0" fontSize="sm">
                      Active Status
                    </FormLabel>
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <Switch
                      id="is-query-contact"
                      isChecked={memberFormData.isQueryContact}
                      colorScheme="purple"
                      onChange={(e) => setMemberFormData({ ...memberFormData, isQueryContact: e.target.checked })}
                      mr="10px"
                    />
                    <FormLabel htmlFor="is-query-contact" mb="0" fontSize="sm">
                      Mark as Official Query Contact
                    </FormLabel>
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={() => setIsMemberModalOpen(false)}>
                Cancel
              </Button>
              <Button
                bg={primaryColor}
                color="white"
                _hover={{ bg: hoverColor }}
                type="submit"
                isLoading={isSavingMember}
              >
                {editingMember ? "Save Changes" : "Create Member"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* =========================================================
          MODAL 2: DELETE MEMBER CONFIRMATION
         ========================================================= */}
      <Modal isOpen={isDeleteMemberModalOpen} onClose={() => setIsDeleteMemberModalOpen(false)}>
        <ModalOverlay />
        <ModalContent borderRadius="16px">
          <ModalHeader color="red.500">Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center" textAlign="center" py="10px">
              <Icon as={FaExclamationTriangle} color="red.500" w="48px" h="48px" mb="16px" />
              <Text fontWeight="bold" fontSize="md">
                Are you sure you want to delete this member?
              </Text>
              <Text color="gray.500" fontSize="sm" mt="6px">
                {memberToDelete && `${memberToDelete.name} (${memberToDelete.post})`}
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsDeleteMemberModalOpen(false)}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleConfirmDeleteMember}
              isLoading={isDeletingMember}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* =========================================================
          MODAL 3: EDIT TERM DETAILS MODAL
         ========================================================= */}
      <Modal isOpen={isTermModalOpen} onClose={() => setIsTermModalOpen(false)}>
        <ModalOverlay />
        <ModalContent borderRadius="16px">
          <ModalHeader bg={primaryColor} color="white" borderTopRadius="16px">
            Edit {currentCommitteeMeta.name} Term & Election Details
          </ModalHeader>
          <ModalCloseButton color="white" />
          <form onSubmit={handleSaveTerm}>
            <ModalBody py="20px">
              <VStack spacing="14px">
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Current Term</FormLabel>
                  <Input
                    placeholder="e.g. 2025 - 2027"
                    value={termFormData.currentTerm}
                    onChange={(e) => setTermFormData({ ...termFormData, currentTerm: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Elected Date</FormLabel>
                  <Input
                    placeholder="e.g. October 2025"
                    value={termFormData.electedDate}
                    onChange={(e) => setTermFormData({ ...termFormData, electedDate: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Next Election Date</FormLabel>
                  <Input
                    placeholder="e.g. October 2027"
                    value={termFormData.nextElectionDate}
                    onChange={(e) => setTermFormData({ ...termFormData, nextElectionDate: e.target.value })}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={() => setIsTermModalOpen(false)}>
                Cancel
              </Button>
              <Button
                bg={primaryColor}
                color="white"
                _hover={{ bg: hoverColor }}
                type="submit"
                isLoading={isSavingTerm}
              >
                Save Term Details
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* =========================================================
          MODAL 4: ADD / EDIT RESPONSIBILITY MODAL
         ========================================================= */}
      <Modal isOpen={isRespModalOpen} onClose={() => setIsRespModalOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="16px">
          <ModalHeader bg={primaryColor} color="white" borderTopRadius="16px">
            {editingResp ? "Edit Responsibility" : "Add New Responsibility"}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <form onSubmit={handleSaveResp}>
            <ModalBody py="20px">
              <VStack spacing="14px">
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Title / Duty Area</FormLabel>
                  <Input
                    placeholder="e.g. Policy Making, Administration, Member Welfare"
                    value={respFormData.title}
                    onChange={(e) => setRespFormData({ ...respFormData, title: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm">Description</FormLabel>
                  <Textarea
                    placeholder="Detailed explanation of committee duty and objectives..."
                    rows={4}
                    value={respFormData.description}
                    onChange={(e) => setRespFormData({ ...respFormData, description: e.target.value })}
                  />
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing="14px" w="100%">
                  <FormControl>
                    <FormLabel fontSize="sm">Display Order</FormLabel>
                    <Input
                      type="number"
                      value={respFormData.displayOrder}
                      onChange={(e) => setRespFormData({ ...respFormData, displayOrder: e.target.value })}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center" pt="30px">
                    <Switch
                      id="resp-active"
                      isChecked={respFormData.isActive}
                      colorScheme="green"
                      onChange={(e) => setRespFormData({ ...respFormData, isActive: e.target.checked })}
                      mr="10px"
                    />
                    <FormLabel htmlFor="resp-active" mb="0" fontSize="sm">
                      Active Status
                    </FormLabel>
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={() => setIsRespModalOpen(false)}>
                Cancel
              </Button>
              <Button
                bg={primaryColor}
                color="white"
                _hover={{ bg: hoverColor }}
                type="submit"
                isLoading={isSavingResp}
              >
                {editingResp ? "Save Changes" : "Create Responsibility"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* =========================================================
          MODAL 5: DELETE RESPONSIBILITY CONFIRMATION
         ========================================================= */}
      <Modal isOpen={isDeleteRespModalOpen} onClose={() => setIsDeleteRespModalOpen(false)}>
        <ModalOverlay />
        <ModalContent borderRadius="16px">
          <ModalHeader color="red.500">Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center" textAlign="center" py="10px">
              <Icon as={FaExclamationTriangle} color="red.500" w="48px" h="48px" mb="16px" />
              <Text fontWeight="bold" fontSize="md">
                Are you sure you want to delete this responsibility?
              </Text>
              <Text color="gray.500" fontSize="sm" mt="6px">
                {respToDelete && respToDelete.title}
              </Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsDeleteRespModalOpen(false)}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleConfirmDeleteResp}
              isLoading={isDeletingResp}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Committees;
