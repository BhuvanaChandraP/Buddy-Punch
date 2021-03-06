import React, { useState } from 'react';
import moment from 'moment';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiService } from '../api.services';
import Navbar from '../components/navbar';
export default function AddClass() {
  const [date, setDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { courseId } = useParams();
  console.log(courseId);

  const addClassHandler = async () => {
    setIsLoading(true);
    try {
      let deadlineDate = date;
      if (deadlineDate !== '') {
        let now = Date.now();
        let deadlineFormat = new Date(deadlineDate);
        if (deadlineFormat < now) {
          setIsLoading(false);
          toast({
            title: 'Error',
            description: `Please enter valid date and time`,
            status: 'warning',
            position: 'bottom-right',
            isClosable: true,
            duration: '5000',
          });
          return;
        }
      }
      let data = {
        dateAndTime: date,
        courseId: courseId,
      };
      let token = localStorage.getItem('Token');
      const res = await ApiService.addClass(data, token);
      console.log(res);
      if (res.status === 200) {
        setIsLoading(false);
        navigate('/faculty/dashboard');
        return;
      }
    } catch (err) {
      console.log(err.response);
      setIsLoading(false);
      if (err.response) {
        toast({
          title: 'Error',
          description: `${err.response.data.message}`,
          status: 'warning',
          position: 'bottom-right',
          isClosable: true,
          duration: '5000',
        });
        return;
      }
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            Schedule class
          </Heading>

          <FormControl id="date" isRequired>
            <FormLabel>Date & Time</FormLabel>
            <Input
              placeholder=""
              _placeholder={{ color: 'gray.500' }}
              type="datetime-local"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={moment().format('YYYY-MM-DD HH:mm')}
            />
          </FormControl>

          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'blue.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'blue.500',
              }}
              isLoading={isLoading}
              onClick={() => addClassHandler()}
            >
              Schedule class
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </>
  );
}
