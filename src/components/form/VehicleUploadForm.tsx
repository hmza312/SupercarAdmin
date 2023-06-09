import { UseDisclosureProp } from '@/types/UseDisclosureProp';
import ModalWrapper, { ModalDropDown, ModalInput } from '../design/ModalWrapper';
import { Flex, Heading, useToast } from '@chakra-ui/react';
import OrangeButton from '../design/OrangeButton';
import { useState } from 'react';
import { MemberDocType, VehicleDocType } from '@/lib/firebase_docstype';
import { ModalFileInput } from '../design/ModalWrapper';

import { carMakes } from '@/util/constant';
import { uploadBlobToFirestore, vehiclesColRef } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { fileToBlob, localTimeStamp } from '@/util/helpers';

const VehicleUploadForm = ({
   handler,
   customers,
   onFinishSubmit
}: {
   onFinishSubmit: () => void;
   handler: UseDisclosureProp;
   customers: MemberDocType[];
}) => {
   const initialFormState: {
      customer: string;
      nickname: string;
      year: string;
      make: string;
      model: string;
      trim: string;
      mileage: string;
      thumbnail: File | null;
      cutout: File | null;
      title: string;
      vin: string;
      odometer: string;
   } = {
      title: '',
      customer: '',
      nickname: '',
      year: '',
      make: '',
      model: '',
      trim: '',
      mileage: '',
      thumbnail: null,
      cutout: null,
      vin: '',
      odometer: ''
   };

   const [formState, setFormState] = useState(initialFormState);
   const [errors, setErrors] = useState<any>({});

   const [loading, setLoading] = useState<boolean>(false);

   const validateForm = () => {
      const newErrors: any = {};

      if (!formState.title) {
         newErrors.customer = 'Please enter title';
      } else if (formState.title.length == 0) {
         newErrors.customer = 'Please enter title';
      }

      if (!formState.customer) {
         newErrors.customer = 'Please select a customer';
      }

      if (!formState.year) {
         newErrors.year = 'Please enter a year';
      } else if (!/^\d{4}$/.test(formState.year)) {
         newErrors.year = 'Please enter a valid 4-digit year';
      }

      if (!formState.make) {
         newErrors.make = 'Please select a make';
      }

      if (!formState.model) {
         newErrors.model = 'Please enter a model';
      }

      if (!formState.trim) {
         newErrors.trim = 'Please enter a trim';
      }

      if (!formState.mileage) {
         newErrors.mileage = 'Please enter mileage';
      } else if (!/^\d+$/.test(formState.mileage)) {
         newErrors.mileage = 'Please enter a valid mileage';
      }

      if (!formState.thumbnail) {
         newErrors.thumbnail = 'Select thumbnail image';
      } else if (formState.thumbnail.type != 'image/png') {
         newErrors.thumbnail = 'Select png file';
      }

      if (formState.cutout && formState.cutout.type != 'image/png') {
         newErrors.cutout = 'Select png file';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const toast = useToast();

   const handleInputChange = (name: string, value: any) => {
      setFormState((prevState) => ({
         ...prevState,
         [name]: value
      }));
   };

   const handleSubmit = async () => {
      const isValid = validateForm();

      if (isValid) {
         setLoading(true);
         const newVehicleDoc = doc(vehiclesColRef);

         let thumbnailUrl = '';
         let cutOutUrl = '';

         // upload image blob to fire_storage

         if (formState.cutout) {
            cutOutUrl = await uploadBlobToFirestore(fileToBlob(formState.cutout));
         }

         if (formState.thumbnail) {
            thumbnailUrl = await uploadBlobToFirestore(fileToBlob(formState.thumbnail));
         }
         
         // do stuff

         await setDoc(newVehicleDoc, {
            cutout: cutOutUrl,
            thumbnail: thumbnailUrl,
            id: newVehicleDoc.id,
            make: formState.make,
            model: formState.model,
            owner: formState.customer,
            status: 1,
            trim: formState.trim,
            timestamp: localTimeStamp(),
            year: formState.year,
            milage: formState.mileage,
            vin: formState.vin,
            odometer: formState.odometer,
            title: formState.title,
            t: ''
         } as VehicleDocType);

         setLoading(false);
         // For example, show a suocess toast message
         toast({
            title: 'Form submitted',
            description: 'Vehicle added successfully',
            status: 'success',
            duration: 3000,
            isClosable: true
         });

         // Reset the form state
         setFormState(initialFormState);
         setErrors({});
         onFinishSubmit();
      } else {
         // Show an error toast message or handle form errors
         // For example, show an error toast message
         toast({
            title: 'Form error',
            description: 'Please fix the form errors',
            status: 'error',
            duration: 3000,
            isClosable: true
         });
      }
   };

   return (
      <ModalWrapper {...handler}>
         <Flex alignItems="center" flexDir="column" color="black" gap="1rem">
            <Heading fontSize="20px" fontWeight="700">
               Add New Vehicle
            </Heading>
         </Flex>

         <Flex flexDir="column" width="100%" gap="0.5rem" color="black">
            <ModalInput
               labelValue="Enter title"
               value={formState.title}
               onChange={(e) => handleInputChange('title', e.target.value)}
               error={errors.title}
            />

            <ModalDropDown
               labelValue="Customer"
               menuItems={customers
                  .map((c) => c.name)
                  .filter((n) => n != '')
                  .sort()}
               menuTitle={formState.customer != '' ? formState.customer : 'Please Select'}
               onSelected={(s) =>
                  handleInputChange('customer', customers.filter((c) => c.name == s)[0].uid)
               }
               error={errors.customer}
            />

            <ModalInput
               labelValue="Nickname (Optional)"
               isOptional={true}
               value={formState.nickname}
               onChange={(e) => handleInputChange('nickname', e.target.value)}
               error={errors.nickname}
            />

            <ModalInput
               labelValue="Year"
               placeholder="e.g. 2019"
               isOptional={false}
               value={formState.year}
               onChange={(e) => handleInputChange('year', e.target.value)}
               error={errors.year}
            />

            <ModalDropDown
               labelValue="Make"
               menuItems={carMakes.sort()}
               menuTitle="Please Select"
               onSelected={(s) => handleInputChange('make', s)}
               error={errors.make}
            />

            <ModalInput
               labelValue="Model"
               placeholder="e.g. Aventador"
               value={formState.model}
               onChange={(e) => handleInputChange('model', e.target.value)}
               error={errors.model}
            />

            <ModalInput
               labelValue="Trim"
               placeholder="e.g. Aventador"
               value={formState.trim}
               onChange={(e) => handleInputChange('trim', e.target.value)}
               error={errors.trim}
            />

            <ModalInput
               labelValue="Mileage"
               placeholder="e.g. 10,500"
               value={formState.mileage}
               onChange={(e) => handleInputChange('mileage', e.target.value)}
               error={errors.mileage}
            />

            <ModalFileInput
               labelValue="Thumbnail Image"
               onChange={(e) => {
                  handleInputChange('thumbnail', e.target.files?.[0]);
               }}
               type="file"
               accept=".png"
               error={errors.thumbnail}
            />

            <ModalFileInput
               labelValue="Vehicle Cutout Image (Optional)"
               onChange={(e) => {
                  handleInputChange('cutout', e.target.files?.[0]);
               }}
               type="file"
               accept=".png"
               error={errors.cutout}
            />

            <ModalInput
               labelValue="Enter vin (Optional)"
               isOptional={true}
               value={formState.vin}
               onChange={(e) => handleInputChange('vin', e.target.value)}
               error={errors.vin}
            />

            <ModalInput
               labelValue="Enter odometer value (Optional)"
               isOptional={true}
               value={formState.odometer}
               onChange={(e) => handleInputChange('odometer', e.target.value)}
               error={errors.odometer}
            />

            <OrangeButton width="100%" onClick={handleSubmit} isLoading={loading}>
               Create Vehicle
            </OrangeButton>
         </Flex>
      </ModalWrapper>
   );
};

export default VehicleUploadForm;
