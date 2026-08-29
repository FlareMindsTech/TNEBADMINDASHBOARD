// Chakra Imports
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Icon,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { FaUserCircle, FaSignOutAlt, FaExclamationTriangle } from "react-icons/fa";

export default function HeaderLinks(props) {
  const { fixed, scrolled, secondary, ...rest } = props;

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const cancelRef = useRef();
  const toast = useToast();

  const openLogout = () => setIsLogoutOpen(true);
  const closeLogout = () => setIsLogoutOpen(false);

  const handleConfirmLogout = () => {
    try {
      closeLogout();
      localStorage.clear();
      sessionStorage.clear();
      toast({
        title: "Logged out successfully",
        description: "Redirecting to sign-in page...",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      const base = window.location.origin + window.location.pathname;
      window.location.replace(`${base}#/auth/signin`);
    } catch (err) {
      toast({
        title: "Logout failed",
        description: err?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Dynamic colors depending on navbar background scroll state
  const isLightNav = fixed && scrolled;
  const textColor = isLightNav
    ? useColorModeValue("gray.700", "gray.200")
    : "white";
  const hoverBg = isLightNav
    ? useColorModeValue("gray.100", "whiteAlpha.200")
    : "whiteAlpha.200";
  const logoutHoverBg = isLightNav
    ? useColorModeValue("red.50", "red.900")
    : "whiteAlpha.300";
  const logoutHoverColor = isLightNav ? "red.500" : "white";

  return (
    <>
      <HStack
        spacing={{ base: 2, sm: 3, md: 4 }}
        alignItems="center"
        flexDirection="row"
      >
        {/* Profile Link Button */}
        <Tooltip label="Admin Profile" hasArrow placement="bottom" openDelay={500}>
          <Button
            as={NavLink}
            to="/admin/profile"
            variant="ghost"
            size={{ base: "sm", md: "md" }}
            color={textColor}
            px={{ base: 2, sm: 3, md: 4 }}
            py={2}
            borderRadius="12px"
            bg="transparent"
            _hover={{ bg: hoverBg, transform: "translateY(-1px)" }}
            _active={{ bg: hoverBg, transform: "none" }}
            transition="all 0.2s ease"
            leftIcon={<Icon as={FaUserCircle} boxSize={{ base: "18px", md: "20px" }} />}
          >
            <Text
              fontSize={{ base: "xs", sm: "sm", md: "sm" }}
              fontWeight="semibold"
              display={{ base: "none", sm: "inline" }}
            >
              Profile
            </Text>
          </Button>
        </Tooltip>

        {/* Logout Button */}
        <Tooltip label="Sign Out" hasArrow placement="bottom" openDelay={500}>
          <Button
            onClick={openLogout}
            variant="ghost"
            size={{ base: "sm", md: "md" }}
            color={textColor}
            px={{ base: 2, sm: 3, md: 4 }}
            py={2}
            borderRadius="12px"
            bg="transparent"
            _hover={{
              bg: logoutHoverBg,
              color: logoutHoverColor,
              transform: "translateY(-1px)",
            }}
            _active={{ bg: logoutHoverBg, transform: "none" }}
            transition="all 0.2s ease"
            leftIcon={<Icon as={MdLogout} boxSize={{ base: "19px", md: "21px" }} />}
          >
            <Text
              fontSize={{ base: "xs", sm: "sm", md: "sm" }}
              fontWeight="semibold"
              display={{ base: "none", sm: "inline" }}
            >
              Logout
            </Text>
          </Button>
        </Tooltip>
      </HStack>

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        isOpen={isLogoutOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeLogout}
        isCentered
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay bg="blackAlpha.600" backdropFilter="blur(4px)">
          <AlertDialogContent borderRadius="2xl" mx={4} overflow="hidden" boxShadow="2xl">
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              bg="red.500"
              color="white"
              py={4}
            >
              <Flex align="center" gap={2}>
                <Icon as={FaSignOutAlt} boxSize={5} />
                <Text>Confirm Logout</Text>
              </Flex>
            </AlertDialogHeader>

            <AlertDialogBody py={6} px={6}>
              <Flex direction="column" align="center" textAlign="center" gap={3}>
                <Box
                  p={3}
                  borderRadius="full"
                  bg="red.50"
                  color="red.500"
                >
                  <Icon as={FaExclamationTriangle} boxSize={8} />
                </Box>
                <Text fontSize="md" fontWeight="bold" color="gray.800">
                  Are you sure you want to sign out?
                </Text>
                <Text fontSize="sm" color="gray.600">
                  You will need to sign in again to access the admin dashboard.
                </Text>
              </Flex>
            </AlertDialogBody>

            <AlertDialogFooter bg="gray.50" py={3} px={6}>
              <Button
                ref={cancelRef}
                onClick={closeLogout}
                variant="ghost"
                borderRadius="xl"
                size="md"
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmLogout}
                ml={3}
                borderRadius="xl"
                size="md"
                leftIcon={<Icon as={MdLogout} />}
              >
                Sign Out
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}