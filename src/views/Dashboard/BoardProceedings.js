import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaTools } from "react-icons/fa";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

function BoardProceedings() {
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = "#0A3D91";
  const bgCard = useColorModeValue("white", "gray.700");

  return (
    <Flex flexDirection="column" pt={{ base: "60px", md: "20px" }} align="center" justify="center" minH="calc(100vh - 160px)" w="100%">
      <Card bg={bgCard} p="24px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" minH="350px" textAlign="center" width="100%" maxW="600px" boxShadow="0px 5px 25px rgba(0, 0, 0, 0.05)">
        <CardBody display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Icon as={FaTools} w={20} h={20} color={iconColor} mb="24px" />
          <Heading as="h2" size="lg" color={textColor} mb="12px">
            Board Proceedings
          </Heading>
          <Text color="gray.500" fontSize="md" fontWeight="medium" maxW="400px">
            This section is currently under construction. We are working hard to bring you the board proceedings soon. Stay tuned!
          </Text>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default BoardProceedings;
