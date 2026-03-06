import React, { useState, useCallback } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  Icon,
  Box,
  VStack,
  HStack,
  keyframes,
  IconButton,
  Badge,
  Divider,
} from "@chakra-ui/react";
import {
  MdAdminPanelSettings,
  MdSecurity,
  MdFingerprint,
} from "react-icons/md";
import {
  GiWindmill,
  GiSolarPower,
  GiPowerGenerator,
  GiLightningStorm,
  GiCircuitry,
  GiPowerLightning,
  GiElectricalResistance,
} from "react-icons/gi";
import { FaWind, FaSolarPanel, FaBolt } from "react-icons/fa";
import { WiDaySunny } from "react-icons/wi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "views/utils/axiosInstance";

function AdminLogin() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const toast = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State for interactive energy flow animations
  const [hoveredElement, setHoveredElement] = useState(null);
  const [focusElement, setFocusElement] = useState(null);
  const [clickEffect, setClickEffect] = useState(false);

  // Professional Energy-themed Animations
  const solarGlow = keyframes`
    0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.4)); transform: scale(1); }
    50% { filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.7)); transform: scale(1.05); }
  `;

  const windSpin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `;

  const waveFlow = keyframes`
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 0.5; }
    100% { transform: translateX(100%); opacity: 0; }
  `;

  const float = keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(2deg); }
  `;

  const pulseRing = keyframes`
    0% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 0.4; }
    100% { transform: scale(0.95); opacity: 0.8; }
  `;

  const particleMove = keyframes`
    0% { transform: translate(0, 0) scale(1); opacity: 0; }
    20% { opacity: 0.8; }
    80% { opacity: 0.8; }
    100% { transform: translate(var(--move-x), var(--move-y)) scale(0); opacity: 0; }
  `;

  const shimmer = keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  `;

  const portalPulse = keyframes`
    0% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.6; }
    100% { transform: scale(1); opacity: 0.3; }
  `;

  // New animations for electrical current (parallax effect)
  const energyFlow = keyframes`
    0% { stroke-dashoffset: 500; opacity: 0; }
    10% { opacity: 1; }
    80% { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  `;

  const sparkFlicker = keyframes`
    0%, 100% { opacity: 0; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  `;

  const currentSurge = keyframes`
    0% { transform: translateY(0) scaleX(1); opacity: 0; }
    20% { opacity: 0.9; }
    80% { opacity: 0.7; }
    100% { transform: translateY(-30px) scaleX(0.5); opacity: 0; }
  `;

  const parallaxFlow = keyframes`
    0% { transform: translate(0, 0) scale(1); opacity: 0; }
    20% { opacity: 0.9; }
    80% { opacity: 0.9; }
    100% { transform: translate(var(--para-x), var(--para-y)) scale(0.2); opacity: 0; }
  `;

  // Handle interactive events
  const handleInputHover = (element) => {
    setHoveredElement(element);
    // Trigger current from all sources
  };

  const handleInputLeave = () => {
    setHoveredElement(null);
  };

  const handleInputFocus = (element) => {
    setFocusElement(element);
    // Stronger current on focus
  };

  const handleInputBlur = () => {
    setFocusElement(null);
  };

  const handleInputClick = () => {
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 800);
  };

  const handleLogin = async () => {
    if (!identifier || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both identifier and password",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/users/login`,
        { identifier, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, name, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ name, identifier, role }));

      toast({
        title: "Access Granted",
        description: `Welcome to the grid, ${name}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      window.location.href = "#/admin/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      toast({
        title: "Access Denied",
        description: err.response?.data?.message || "Invalid credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Determine if currents should be active
  const isActive = hoveredElement || focusElement || clickEffect || loading;

  // Helper to get random delay
  const getRandomDelay = (min, max) => `${Math.random() * (max - min) + min}s`;

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
      bg="linear-gradient(145deg, #0B1E33 0%, #0A2A44 50%, #0C3A5E 100%)"
      overflow="hidden"
      fontFamily="'Inter', sans-serif"
    >
      {/* Smart Grid Background Pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.12"
        pointerEvents="none"
        zIndex={1}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2196F3" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </Box>

      {/* Background Energy Connections (static) */}
      <Box position="absolute" top="0" left="0" w="100%" h="100%" pointerEvents="none" zIndex={1}>
        <svg width="100%" height="100%">
          <line x1="15%" y1="20%" x2="50%" y2="50%" stroke="url(#energyGradient)" strokeWidth="1" strokeDasharray="10 5" opacity="0.2">
            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="5s" repeatCount="indefinite" />
          </line>
          <line x1="85%" y1="20%" x2="50%" y2="50%" stroke="url(#energyGradient)" strokeWidth="1" strokeDasharray="10 5" opacity="0.2">
            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="6s" repeatCount="indefinite" />
          </line>
          <line x1="15%" y1="85%" x2="50%" y2="50%" stroke="url(#energyGradient)" strokeWidth="1" strokeDasharray="10 5" opacity="0.2">
            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="85%" y1="85%" x2="50%" y2="50%" stroke="url(#energyGradient)" strokeWidth="1" strokeDasharray="10 5" opacity="0.2">
            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="7s" repeatCount="indefinite" />
          </line>
          <defs>
            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2196F3" stopOpacity="0" />
              <stop offset="50%" stopColor="#2196F3" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2196F3" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </Box>

      {/* ========== DYNAMIC ENERGY CURRENTS FROM SOURCES TO LOGIN CARD ========== */}
      {/* These currents appear on hover/focus/click with parallax effect */}

      {/* Energy from Solar Farm (Top Right) to Login Card */}
      {(isActive) && (
        <Box position="absolute" top="0" left="0" w="100%" h="100%" pointerEvents="none" zIndex={12}>
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            <defs>
              <linearGradient id="solarCurrent" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#FFA500" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="windCurrent" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4FC3F7" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#2196F3" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0D47A1" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hydroCurrent" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4FC3F7" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#00BCD4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#006064" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="towerCurrent" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B0BEC5" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#90A4AE" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#546E7A" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Solar Farm to Login Card - multiple rays with parallax */}
            {[...Array(focusElement ? 8 : 4)].map((_, i) => (
              <path
                key={`solar-${i}`}
                d={`M 85% 10% C ${75 + i * 2}% ${20 + i * 3}%, ${65 + i * 1}% ${30 + i * 2}%, 50% 50%`}
                stroke="url(#solarCurrent)"
                strokeWidth={focusElement ? 4 : 2.5}
                strokeDasharray="12 24"
                fill="none"
                opacity={hoveredElement ? 0.9 : 0.6}
                style={{
                  animation: `${energyFlow} ${1 + i * 0.3}s linear infinite`,
                  animationDelay: `${i * 0.2}s`,
                  filter: 'drop-shadow(0 0 8px #FFD700)',
                }}
              />
            ))}

            {/* Wind Farm to Login Card (Top Left) */}
            {[...Array(focusElement ? 6 : 3)].map((_, i) => (
              <path
                key={`wind-${i}`}
                d={`M 15% 15% C ${25 + i * 3}% ${25 + i * 2}%, ${35 + i * 2}% ${35 + i * 1}%, 50% 50%`}
                stroke="url(#windCurrent)"
                strokeWidth={focusElement ? 4 : 2.5}
                strokeDasharray="10 20"
                fill="none"
                opacity={hoveredElement ? 0.9 : 0.6}
                style={{
                  animation: `${energyFlow} ${1.2 + i * 0.2}s linear infinite`,
                  animationDelay: `${i * 0.15}s`,
                  filter: 'drop-shadow(0 0 6px #2196F3)',
                }}
              />
            ))}

            {/* Hydro/Generator to Login Card (Bottom Left) */}
            {[...Array(focusElement ? 5 : 3)].map((_, i) => (
              <path
                key={`hydro-${i}`}
                d={`M 15% 80% C ${25 + i * 2}% ${65 + i * 1}%, ${35 + i * 1}% ${55 + i * 2}%, 50% 50%`}
                stroke="url(#hydroCurrent)"
                strokeWidth={focusElement ? 3.5 : 2}
                strokeDasharray="8 16"
                fill="none"
                opacity={hoveredElement ? 0.8 : 0.5}
                style={{
                  animation: `${energyFlow} ${1.4 + i * 0.25}s linear infinite`,
                  animationDelay: `${i * 0.25}s`,
                  filter: 'drop-shadow(0 0 6px #4FC3F7)',
                }}
              />
            ))}

            {/* Left Tower to Login Card */}
            {[...Array(focusElement ? 4 : 2)].map((_, i) => (
              <path
                key={`tower-left-${i}`}
                d={`M 10% 70% C ${20 + i * 2}% ${60 + i * 2}%, ${30 + i * 3}% ${55 + i * 1}%, 50% 50%`}
                stroke="url(#towerCurrent)"
                strokeWidth={focusElement ? 3 : 1.8}
                strokeDasharray="6 14"
                fill="none"
                opacity={hoveredElement ? 0.7 : 0.4}
                style={{
                  animation: `${energyFlow} ${1.6 + i * 0.2}s linear infinite`,
                  animationDelay: `${i * 0.3}s`,
                  filter: 'drop-shadow(0 0 4px #90A4AE)',
                }}
              />
            ))}

            {/* Right Tower to Login Card */}
            {[...Array(focusElement ? 4 : 2)].map((_, i) => (
              <path
                key={`tower-right-${i}`}
                d={`M 90% 70% C ${80 - i * 2}% ${60 + i * 2}%, ${70 - i * 3}% ${55 + i * 1}%, 50% 50%`}
                stroke="url(#towerCurrent)"
                strokeWidth={focusElement ? 3 : 1.8}
                strokeDasharray="6 14"
                fill="none"
                opacity={hoveredElement ? 0.7 : 0.4}
                style={{
                  animation: `${energyFlow} ${1.5 + i * 0.25}s linear infinite`,
                  animationDelay: `${i * 0.35}s`,
                  filter: 'drop-shadow(0 0 4px #90A4AE)',
                }}
              />
            ))}
          </svg>

          {/* Parallax Energy Particles - move toward login card with varying speeds */}
          {[...Array(20)].map((_, i) => {
            // Random starting positions near energy sources
            const source = Math.floor(Math.random() * 4);
            let startX, startY;
            if (source === 0) { startX = 85; startY = 10; } // Solar
            else if (source === 1) { startX = 15; startY = 15; } // Wind
            else if (source === 2) { startX = 15; startY = 80; } // Hydro
            else { startX = Math.random() > 0.5 ? 5 : 95; startY = 70; } // Towers

            const targetX = 50; // Login card center
            const targetY = 50;

            // Parallax movement: different speeds and paths
            const moveX = targetX - startX + (Math.random() - 0.5) * 20;
            const moveY = targetY - startY + (Math.random() - 0.5) * 20;

            return (
              <Box
                key={`particle-current-${i}`}
                position="absolute"
                left={`${startX}%`}
                top={`${startY}%`}
                w={`${Math.random() * 6 + 3}px`}
                h={`${Math.random() * 6 + 3}px`}
                bg={source === 0 ? "#FFD700" : source === 1 ? "#2196F3" : source === 2 ? "#4FC3F7" : "#B0BEC5"}
                borderRadius="full"
                zIndex={13}
                style={{
                  "--para-x": `${moveX}vw`,
                  "--para-y": `${moveY}vh`,
                  boxShadow: `0 0 15px ${source === 0 ? "#FFD700" : "#2196F3"}`,
                  filter: "blur(1px)",
                }}
                animation={`${parallaxFlow} ${Math.random() * 1.5 + 0.8}s ease-out infinite`}
                animationDelay={`${Math.random() * 0.5}s`}
                opacity={isActive ? 0.9 : 0}
              />
            );
          })}
        </Box>
      )}

      {/* Login Energy Surge - Enhanced when active */}
      {(loading || clickEffect) && (
        <Box position="absolute" top="0" left="0" w="100%" h="100%" pointerEvents="none" zIndex={15}>
          <svg width="100%" height="100%" style={{ filter: 'drop-shadow(0 0 12px #2196F3)' }}>
            <defs>
              <linearGradient id="surgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2196F3" stopOpacity="0" />
                <stop offset="50%" stopColor="#64B5F6" stopOpacity="1" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Intense surges from all sources */}
            <path d="M 15% 15% Q 30% 25%, 50% 50%" stroke="url(#surgeGradient)" strokeWidth="6" fill="none" strokeDasharray="150 450" style={{ animation: `${energyFlow} 0.8s infinite linear` }} />
            <path d="M 85% 15% Q 70% 25%, 50% 50%" stroke="url(#surgeGradient)" strokeWidth="6" fill="none" strokeDasharray="150 450" style={{ animation: `${energyFlow} 0.7s infinite linear` }} />
            <path d="M 15% 85% Q 30% 75%, 50% 50%" stroke="url(#surgeGradient)" strokeWidth="6" fill="none" strokeDasharray="150 450" style={{ animation: `${energyFlow} 0.9s infinite linear` }} />
            <path d="M 5% 80% Q 25% 65%, 50% 50%" stroke="url(#surgeGradient)" strokeWidth="6" fill="none" strokeDasharray="150 450" style={{ animation: `${energyFlow} 0.75s infinite linear` }} />
            <path d="M 95% 80% Q 75% 65%, 50% 50%" stroke="url(#surgeGradient)" strokeWidth="6" fill="none" strokeDasharray="150 450" style={{ animation: `${energyFlow} 0.85s infinite linear` }} />
          </svg>

          {/* Central Portal Effect */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="600px"
            h="600px"
            bg="radial-gradient(circle, rgba(33, 150, 243, 0.3) 0%, transparent 70%)"
            animation={`${portalPulse} 0.8s infinite ease-in-out`}
          />
        </Box>
      )}

      {/* Floating Energy Particles */}
      {[...Array(15)].map((_, i) => (
        <Box
          key={`particle-${i}`}
          position="absolute"
          w={`${Math.random() * 4 + 2}px`}
          h={`${Math.random() * 4 + 2}px`}
          bg="#2196F3"
          borderRadius="full"
          opacity="0.4"
          zIndex={1}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            "--move-x": `${(Math.random() - 0.5) * 300}px`,
            "--move-y": `${(Math.random() - 0.5) * 300}px`,
          }}
          animation={`${particleMove} ${Math.random() * 10 + 5}s linear infinite`}
          animationDelay={`${Math.random() * 5}s`}
          filter="blur(1px)"
          boxShadow="0 0 10px #2196F3"
        />
      ))}

      {/* Solar Farm - Top Right */}
      <Box
        position="absolute"
        top="8%"
        right="8%"
        zIndex={2}
        onMouseEnter={() => handleInputHover('solar')}
        onMouseLeave={handleInputLeave}
      >
        <VStack spacing={4} align="flex-end">
          <Box position="relative">
            <Icon
              as={WiDaySunny}
              w="80px"
              h="80px"
              color="#FFD700"
              animation={`${solarGlow} ${isActive ? '0.6s' : '3s'} infinite, ${float} 4s infinite`}
              filter={isActive ? "brightness(2) drop-shadow(0 0 25px #FFD700)" : "none"}
              transition="all 0.3s ease"
            />
            {/* Sparks on active */}
            {isActive && (
              <>
                <Box position="absolute" top="0" right="0" w="10px" h="10px" bg="yellow.300" borderRadius="full" animation={`${sparkFlicker} 0.3s infinite`} />
                <Box position="absolute" bottom="0" left="0" w="8px" h="8px" bg="orange.400" borderRadius="full" animation={`${sparkFlicker} 0.4s infinite`} />
              </>
            )}
          </Box>
          <HStack spacing={3}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Box key={i} position="relative">
                <Icon
                  as={GiSolarPower}
                  w="35px"
                  h="35px"
                  color="rgba(255, 215, 0, 0.8)"
                  filter={isActive ? "drop-shadow(0 0 15px rgba(255,200,0,0.6))" : "drop-shadow(0 0 8px rgba(255, 200, 0, 0.3))"}
                />
                {isActive && (
                  <Box
                    position="absolute"
                    top="-5px"
                    right="-5px"
                    w="8px"
                    h="8px"
                    bg="yellow.400"
                    borderRadius="full"
                    animation={`${pulseRing} 0.5s infinite`}
                  />
                )}
              </Box>
            ))}
          </HStack>
          <Badge
            bg="rgba(255, 215, 0, 0.15)"
            color="yellow.300"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            border="1px solid rgba(255, 215, 0, 0.3)"
          >
            2.4 MW Peak Capacity
          </Badge>
        </VStack>
      </Box>

      {/* Wind Farm - Top Left */}
      <Box
        position="absolute"
        top="10%"
        left="8%"
        zIndex={2}
        onMouseEnter={() => handleInputHover('wind')}
        onMouseLeave={handleInputLeave}
      >
        <VStack spacing={4} align="flex-start">
          <HStack spacing={5}>
            {[1, 2, 3].map((i) => (
              <Box key={i} position="relative">
                <Box
                  position="relative"
                  animation={`${float} ${3 + i * 0.5}s infinite`}
                  animationDelay={`${i * 0.2}s`}
                >
                  <Box
                    w="6px"
                    h="70px"
                    bg="linear-gradient(180deg, #90A4AE, #607D8B)"
                    borderRadius="full"
                    mx="auto"
                    boxShadow="0 4px 12px rgba(0,0,0,0.2)"
                  />
                  <Box
                    position="relative"
                    top="-55px"
                    left="-20px"
                    animation={`${windSpin} ${isActive ? 4 - i * 0.3 : 8 - i * 0.5}s linear infinite`}
                  >
                    <Icon
                      as={GiWindmill}
                      w="45px"
                      h="45px"
                      color={isActive ? "#4FC3F7" : "rgba(200, 230, 255, 0.9)"}
                      filter={isActive ? "brightness(1.5) drop-shadow(0 0 20px #2196F3)" : "none"}
                      transition="all 0.3s ease"
                    />
                  </Box>
                </Box>
                {isActive && (
                  <Box
                    position="absolute"
                    top="20%"
                    left="10%"
                    w="15px"
                    h="15px"
                    bg="blue.300"
                    borderRadius="full"
                    filter="blur(3px)"
                    animation={`${currentSurge} 0.6s infinite`}
                  />
                )}
              </Box>
            ))}
          </HStack>
          <HStack>
            <Icon as={FaWind} color="#81D4FA" />
            <Badge
              bg="rgba(33, 150, 243, 0.15)"
              color="blue.300"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
              border="1px solid rgba(33, 150, 243, 0.3)"
            >
              850 kW Generation
            </Badge>
          </HStack>
        </VStack>
      </Box>

      {/* Hydro Energy - Bottom Left */}
      <Box
        position="absolute"
        bottom="12%"
        left="10%"
        zIndex={2}
        onMouseEnter={() => handleInputHover('hydro')}
        onMouseLeave={handleInputLeave}
      >
        <HStack spacing={8}>
          <Box position="relative">
            <Icon
              as={GiPowerGenerator}
              w="50px"
              h="50px"
              color={isActive ? "#FFFFFF" : "#4FC3F7"}
              filter={isActive ? "brightness(1.5) drop-shadow(0 0 25px #4FC3F7)" : "none"}
              animation={isActive ? `${pulseRing} 0.5s infinite` : "none"}
              transition="all 0.3s ease"
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              w="60px"
              h="60px"
              border="2px solid"
              borderColor="#4FC3F7"
              borderRadius="full"
              transform="translate(-50%, -50%)"
              opacity="0.3"
              animation={`${pulseRing} 3s infinite`}
            />
          </Box>
          <Box w="100px" position="relative">
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                position="absolute"
                top={`${i * 12}px`}
                left="0"
                w="100%"
                h="2px"
                bg="linear-gradient(90deg, transparent, #4FC3F7, transparent)"
                animation={`${waveFlow} ${isActive ? 1 + i * 0.3 : 2 + i * 0.5}s infinite`}
                animationDelay={`${i * 0.2}s`}
                opacity={isActive ? 0.7 - i * 0.05 : 0.4 - i * 0.05}
              />
            ))}
          </Box>
          <Text fontSize="xs" color="#B0E0E6" fontWeight="600">
            Hydro • 380 MW
          </Text>
        </HStack>
      </Box>

      {/* High-Voltage Transmission Tower - Left */}
      <Box
        position="absolute"
        left="5%"
        bottom="10%"
        zIndex={2}
        display={{ base: "none", xl: "block" }}
        opacity={0.8}
        onMouseEnter={() => handleInputHover('tower-left')}
        onMouseLeave={handleInputLeave}
      >
        <svg width="120" height="280" viewBox="0 0 100 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 L20 240 M50 10 L80 240 M20 240 L80 240" stroke="#455A64" strokeWidth="2.5" />
          <path d="M35 60 L65 60 M25 100 L75 100 M15 150 L85 150" stroke="#455A64" strokeWidth="2.5" />
          <path d="M35 60 L50 40 L65 60 M25 100 L50 80 L75 100 M15 150 L50 130 L85 150" stroke="#455A64" strokeWidth="1.5" />
          <path d="M35 60 L40 100 M65 60 L60 100 M25 100 L30 150 M75 100 L70 150" stroke="#455A64" strokeWidth="1.5" />
          <circle cx="35" cy="68" r="3" fill="#263238" stroke="#90A4AE" strokeWidth="1" />
          <circle cx="65" cy="68" r="3" fill="#263238" stroke="#90A4AE" strokeWidth="1" />
          <circle cx="25" cy="108" r="3" fill="#263238" stroke="#90A4AE" strokeWidth="1" />
          <circle cx="75" cy="108" r="3" fill="#263238" stroke="#90A4AE" strokeWidth="1" />
        </svg>
        {isActive && (
          <Box position="absolute" top="20%" left="50%" w="8px" h="8px" bg="blue.200" borderRadius="full" boxShadow="0 0 15px #2196F3" animation={`${sparkFlicker} 0.2s infinite`} />
        )}
      </Box>

      {/* High-Voltage Transmission Tower - Right */}
      <Box
        position="absolute"
        right="5%"
        bottom="10%"
        zIndex={2}
        display={{ base: "none", xl: "block" }}
        opacity={0.8}
        onMouseEnter={() => handleInputHover('tower-right')}
        onMouseLeave={handleInputLeave}
      >
        <svg width="120" height="280" viewBox="0 0 100 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 L20 240 M50 10 L80 240 M20 240 L80 240" stroke="#455A64" strokeWidth="2.5" />
          <path d="M35 60 L65 60 M25 100 L75 100 M15 150 L85 150" stroke="#455A64" strokeWidth="2.5" />
          <path d="M35 60 L50 40 L65 60 M25 100 L50 80 L75 100 M15 150 L50 130 L85 150" stroke="#455A64" strokeWidth="1.5" />
          <path d="M35 60 L40 100 M65 60 L60 100 M25 100 L30 150 M75 100 L70 150" stroke="#455A64" strokeWidth="1.5" />
          <circle cx="35" cy="68" r="3" fill="#263238" stroke="#90A4AE" strokeWidth="1" />
          <circle cx="65" cy="68" r="3" fill="#263238" stroke="#90A4AE" strokeWidth="1" />
          <circle cx="25" cy="108" r="3" fill="#263238" stroke="#90A4AE" strokeWidth="1" />
          <circle cx="75" cy="108" r="3" fill="#263238" stroke="#90A4AE" strokeWidth="1" />
        </svg>
        {isActive && (
          <Box position="absolute" top="20%" left="50%" w="8px" h="8px" bg="blue.200" borderRadius="full" boxShadow="0 0 15px #2196F3" animation={`${sparkFlicker} 0.3s infinite`} />
        )}
      </Box>

      {/* Generation Stats Bar */}
      <HStack
        position="absolute"
        bottom="5%"
        left="50%"
        transform="translateX(-50%)"
        bg="rgba(10, 42, 68, 0.8)"
        backdropFilter="blur(10px)"
        px={8}
        py={4}
        borderRadius="20px"
        border="1px solid rgba(33, 150, 243, 0.2)"
        spacing={10}
        zIndex={5}
        display={{ base: "none", lg: "flex" }}
      >
        <VStack spacing={0} align="start">
          <Text fontSize="10px" color="blue.300" fontWeight="700" letterSpacing="1px">SOLAR HARVEST</Text>
          <Text fontSize="18px" color="white" fontWeight="800">1,280 <Text as="span" fontSize="10px">kW</Text></Text>
        </VStack>
        <Divider orientation="vertical" h="30px" borderColor="rgba(255,255,255,0.1)" />
        <VStack spacing={0} align="start">
          <Text fontSize="10px" color="blue.300" fontWeight="700" letterSpacing="1px">WIND YIELD</Text>
          <Text fontSize="18px" color="white" fontWeight="800">850 <Text as="span" fontSize="10px">kW</Text></Text>
        </VStack>
        <Divider orientation="vertical" h="30px" borderColor="rgba(255,255,255,0.1)" />
        <VStack spacing={0} align="start">
          <Text fontSize="10px" color="blue.300" fontWeight="700" letterSpacing="1px">GRID LOAD</Text>
          <Text fontSize="18px" color="green.400" fontWeight="800">STABLE</Text>
        </VStack>
      </HStack>

      {/* Substation / Transformer - Bottom Right */}
      <Box
        position="absolute"
        right="5%"
        bottom="15%"
        zIndex={2}
        opacity={0.8}
        display={{ base: "none", xl: "block" }}
        onMouseEnter={() => handleInputHover('substation')}
        onMouseLeave={handleInputLeave}
      >
        <VStack spacing={2}>
          <Icon as={GiElectricalResistance} w="60px" h="60px" color="#90A4AE" />
          <Badge colorScheme="blue" variant="outline" fontSize="9px">Substation Alpha-1</Badge>
        </VStack>
      </Box>

      {/* Main Login Card */}
      <Flex
        position="relative"
        zIndex={10}
        w={{ base: "90%", md: "450px" }}
        bg="rgba(255, 255, 255, 0.98)"
        backdropFilter="blur(20px)"
        borderRadius="28px"
        boxShadow={isActive ? "0 25px 50px -12px rgba(33,150,243,0.4)" : "0 25px 50px -12px rgba(0,0,0,0.25)"}
        border="1px solid rgba(33, 150, 243, 0.15)"
        direction="column"
        overflow="hidden"
        transition="box-shadow 0.3s ease"
      >
        {/* Header with Energy Gradient */}
        <Box
          bg="linear-gradient(135deg, #0A2A44 0%, #0C3A5E 100%)"
          p={8}
          position="relative"
          overflow="hidden"
        >
          {/* Energy Arc Animation - enhanced on active */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            opacity="0.1"
          >
            <svg width="100%" height="100%">
              <circle cx="50%" cy="50%" r="80" fill="none" stroke="#64B5F6" strokeWidth="1" strokeDasharray="4 4">
                <animate
                  attributeName="r"
                  values="60;100;60"
                  dur={isActive ? "4s" : "8s"}
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </Box>

          <VStack spacing={3}>
            <Flex
              w="80px"
              h="80px"
              bg="linear-gradient(145deg, #2196F3, #1976D2)"
              borderRadius="22px"
              align="center"
              justify="center"
              boxShadow={isActive ? "0 8px 30px rgba(33, 150, 243, 0.6)" : "0 8px 20px rgba(33, 150, 243, 0.3)"}
              transform="rotate(10deg)"
              transition="box-shadow 0.3s"
            >
              <Box transform="rotate(-10deg)">
                <Icon as={MdAdminPanelSettings} w="45px" h="45px" color="white" />
              </Box>
            </Flex>

            <VStack spacing={1}>
              <Text
                fontSize="28px"
                fontWeight="800"
                color="white"
                letterSpacing="-0.5px"
              >
                TNEBEA
              </Text>

            </VStack>
          </VStack>

          {/* Status Indicators */}
          <HStack
            position="absolute"
            bottom="4"
            left="6"
            right="6"
            justify="space-between"
          >

          </HStack>
        </Box>

        {/* Login Form */}
        <VStack p={8} spacing={6}>
          <VStack spacing={4} w="100%">
            {/* Admin ID Field */}
            <FormControl>
              <FormLabel
                fontSize="xs"
                fontWeight="600"
                color="#0C3A5E"
                textTransform="uppercase"
                letterSpacing="1px"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={GiCircuitry} color="#2196F3" />
                Admin Identifier
              </FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="employee@tneb.gov.in"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onMouseEnter={() => handleInputHover('identifier')}
                  onMouseLeave={handleInputLeave}
                  onFocus={() => handleInputFocus('identifier')}
                  onBlur={handleInputBlur}
                  onClick={handleInputClick}
                  h="54px"
                  bg="white"
                  border="2px solid"
                  borderColor={focusElement === 'identifier' ? '#2196F3' : 'gray.100'}
                  borderRadius="16px"
                  fontSize="15px"
                  _placeholder={{ color: 'gray.400' }}
                  _hover={{ borderColor: '#2196F3' }}
                  _focus={{
                    borderColor: '#1976D2',
                    boxShadow: '0 0 0 4px rgba(33, 150, 243, 0.1)',
                    borderWidth: '2px'
                  }}
                  transition="all 0.2s"
                />
              </InputGroup>
            </FormControl>

            {/* Password Field */}
            <FormControl>
              <FormLabel
                fontSize="xs"
                fontWeight="600"
                color="#0C3A5E"
                textTransform="uppercase"
                letterSpacing="1px"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={MdFingerprint} color="#2196F3" />
                Access Key
              </FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onMouseEnter={() => handleInputHover('password')}
                  onMouseLeave={handleInputLeave}
                  onFocus={() => handleInputFocus('password')}
                  onBlur={handleInputBlur}
                  onClick={handleInputClick}
                  h="54px"
                  bg="white"
                  border="2px solid"
                  borderColor={focusElement === 'password' ? '#2196F3' : 'gray.100'}
                  borderRadius="16px"
                  fontSize="15px"
                  _placeholder={{ color: 'gray.400' }}
                  _hover={{ borderColor: '#2196F3' }}
                  _focus={{
                    borderColor: '#1976D2',
                    boxShadow: '0 0 0 4px rgba(33, 150, 243, 0.1)',
                    borderWidth: '2px'
                  }}
                />
                <InputRightElement h="54px" w="60px">
                  <IconButton
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    color="#2196F3"
                    _hover={{ bg: 'rgba(33, 150, 243, 0.1)' }}
                    size="lg"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Login Button */}
            <Button
              w="100%"
              h="54px"
              bg="linear-gradient(145deg, #0A2A44, #0C3A5E)"
              color="white"
              onClick={handleLogin}
              isLoading={loading}
              fontSize="16px"
              fontWeight="600"
              borderRadius="16px"
              letterSpacing="1px"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 25px -8px rgba(12, 58, 94, 0.4)',
                bg: 'linear-gradient(145deg, #0C3A5E, #0E4B74)'
              }}
              _active={{ transform: 'translateY(0)' }}
              leftIcon={<Icon as={GiPowerLightning} w="20px" h="20px" />}
              loadingText="Authenticating..."
              position="relative"
              overflow="hidden"
              transition="all 0.3s ease"
              _after={{
                content: '""',
                position: 'absolute',
                top: '0',
                left: '-100%',
                w: '100%',
                h: '100%',
                bg: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                backgroundSize: '200% 100%',
                animation: `${shimmer} 2.5s infinite`
              }}
            >
              ACCESS ENERGY GRID
            </Button>

            {/* Security Badge */}
            <HStack justify="center" w="100%" pt={2}>
              <Icon as={MdSecurity} color="#4CAF50" />
              <Text fontSize="xs" color="gray.600" fontWeight="500">
                Secure Access • 256-bit Encryption
              </Text>
            </HStack>
          </VStack>

          <Divider borderColor="gray.200" />

          {/* Footer */}

          <Text fontSize="10px" color="gray.500" textAlign="center">
            © 2024 TNEBEA • All rights reserved
          </Text>
        </VStack>
      </Flex>

      {/* Energy Flow Lines */}
      <Box position="absolute" bottom="0" left="0" right="0" height="2px" zIndex={5}>
        <svg width="100%" height="2">
          <line x1="0" y1="1" x2="100%" y2="1" stroke="#2196F3" strokeWidth="1" strokeDasharray="4 4">
            <animate attributeName="stroke-dashoffset" values="0;100" dur="20s" repeatCount="indefinite" />
          </line>
        </svg>
      </Box>
    </Flex>
  );
}

export default AdminLogin;