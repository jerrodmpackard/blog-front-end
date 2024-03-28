'use client';
// use client NEEDS to be at the top level of our file. Very first line of code

import { Accordion, Button, Dropdown, FileInput, Label, ListGroup, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import React from 'react'
// The @ when pathing through our file structure inside an import signifies that you are accessing the root folder
import BlogEntries from '@/utils/BlogEntries.json'
import { IBlogItems } from '@/Interfaces/Interfaces';
import NavbarComponent from '../Components/NavbarComponent';
import { addBlogItem, checkToken, getBlogItemsByUserID, loggedInData, updateBlogItem } from '@/utils/DataServices';
import { useRouter } from 'next/navigation';
// import { format } from '../../../node_modules/date-fn'


// Think of this as the user's dashboard page with their published and unpublished blog entries
// We would also like to be able to add/edit blog entries here
const Dashboard = () => {
    const [openModal, setOpenModal] = useState(false);
    // We have to add the array to the IBlogItems because our .json data is in an array. It is an array of objects
    const [blogItems, setBlogItems] = useState<IBlogItems[]>();


    // We will need to create useState variables for description, tags, categories, title, and image
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [tags, setTags] = useState<string>('');
    const [categories, setCategories] = useState<string>('');
    const [image, setImage] = useState<any>('');
    // Adding useStates for id, publisher name, 
    const [blogUserID, setBlogUserID] = useState<number>(0);
    const [publisherName, setPublisherName] = useState<string>('');
    const [blogID, setBlogID] = useState<number>(0);



    // Booleans
    const [editBool, setEditBool] = useState<boolean>(true);


    // useRouter should be from next/navigation when you enter it/import it at the top of this page
    let router = useRouter();


    // Creating a useEffect to grab the user's information as well as their blog info
    // It will perform a check if user is logged in. If not, it will takethem to the login page.
    useEffect(() => {


        // Async function because we are calling getBlogItemsByUserID fetch
        const getLoggedInData = async () => {


            // Storing our user info in a variable
            const loggedIn = loggedInData();


            // We give userBlogItems a type of IBlogItems to remove errors from the .filter. Item had an error that said type any. Giving userBlogItems a type has resolved this error
            let userBlogItems: IBlogItems[] = await getBlogItemsByUserID(loggedIn.userId);
            let filteredBlogItems = userBlogItems.filter(item => item.isDeleted === false);


            // Setting our user info/fetched data inside of our state variables
            setBlogUserID(loggedIn.userId);
            setPublisherName(loggedIn.publisherName);
            setBlogItems(filteredBlogItems);
        }



        // Checks if we have a token in local storage. If so, gets user info. Else, routes user back to login page
        if (checkToken()) {
            getLoggedInData();
        } else {
            router.push('/');
        }
    }, [])


    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {

        let item: IBlogItems = {
            id: blogID,
            userID: blogUserID,
            publishedName: publisherName,
            description: description,
            date: new Date().toString(),
            title: title,
            image: image,
            tags: tags,
            categories: categories,
            isPublished: e.currentTarget.textContent === "Save and Publish" ? true : false,
            isDeleted: false
        }


        let result = false;


        // If editBool is true, we are updating our blog item
        // If it is false, we should be adding a new blog item
        if (editBool) {
            result = await updateBlogItem(item);
        } else {
            result = await addBlogItem(item);
        }


        // If our blog is updated / add we will call our blog items again from our api
        if (result) {
            let userBlogItems: IBlogItems[] = await getBlogItemsByUserID(blogUserID);
            let filteredBlogItems = userBlogItems.filter(item => item.isDeleted === false);
            setBlogItems(filteredBlogItems);
        }


        setOpenModal(false);
    }



    // Make a function to open the modal and clear the previous inputs for all 5 input fields
    const handleShow = () => {
        setOpenModal(true);
        setEditBool(false);

        setTitle('');
        setDescription('');
        setTags('');
        setCategories('');
        setImage('');
    }


    // Make a function to close the modal, save and publish, and also edit our blog items from the modal
    const handlePublish = async (items: IBlogItems) => {
        items.isPublished = !items.isPublished;
        let result = await updateBlogItem(items);

        if (result) {
            const loggedIn = loggedInData();
            let userBlogItems: IBlogItems[] = await getBlogItemsByUserID(loggedIn.userId);
            let filteredBlogItems = userBlogItems.filter(item => item.isDeleted === false);
            setBlogItems(filteredBlogItems);
        }
    }


    // To edit, we have to make sure our setEditBool is true.
    // We must also pass in all of the blog properties
    const handleEdit = (items: IBlogItems) => {
        setEditBool(true);
        setOpenModal(true);

        setBlogID(items.id);
        setPublisherName(items.publishedName);
        setTitle(items.title);
        setDescription(items.description);
        setTags(items.tags);
        setCategories(items.categories);
        setImage(items.image);
    }


    const handleDelete = async (items: IBlogItems) => {
        items.isDeleted = !items.isDeleted;
        let result = await updateBlogItem(items);

        if (result) {
            const loggedIn = loggedInData();
            let userBlogItems: IBlogItems[] = await getBlogItemsByUserID(loggedIn.userId);
            let filteredBlogItems = userBlogItems.filter(item => item.isDeleted === false);
            setBlogItems(filteredBlogItems);
        }
    }


    // Now we need to create our helper functions for each of these
    const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
    const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value);
    const handleTags = (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value);

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        // This will take in our image and convert it into a string
        let reader = new FileReader();

        // The files is a little wonky, but this is the syntax for that. It must be nullable and we need to access the first element of the array using dot notation
        const file = e.target.files?.[0];

        if (file) {
            reader.onload = () => {
                console.log(reader.result); // Console log this reader.result to see the crazy long string of data that will be saved from the image after it is converted to a string
                setImage(reader.result);
            }
            reader.readAsDataURL(file);
        }
    }

    return (
        <>
            <NavbarComponent />

            <div className='flex min-h-screen flex-col p-24'>
                <div className="flex flex-col items-center mb-10">
                    <h1 className='text-3xl'>This is Dashboard</h1>

                    <Button className='my-5' onClick={handleShow}>Add Blog Item</Button>
                    <Modal show={openModal} onClose={() => setOpenModal(false)}>
                        <Modal.Header>{editBool ? 'Edit' : 'Add'} Blog Item</Modal.Header>
                        <Modal.Body>
                            <form className="flex max-w-md flex-col gap-4">
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="Title" value="Title" />
                                    </div>
                                    <TextInput onChange={handleTitle} id="Title" type="text" placeholder="Enter Title" required />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="Description" value="Description" />
                                    </div>
                                    <TextInput onChange={handleDescription} id="Description" type="text" placeholder="Enter Description" required />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="Tags" value="Tags" />
                                    </div>
                                    <TextInput onChange={handleTags} id="Tags" type="text" placeholder="Enter Tags" required />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="Picture" value="Picture" />
                                    </div>
                                    <FileInput onChange={handleImage} accept='image/png, image/jpg' id="Picture" placeholder='Choose Image' required />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Dropdown label="Category" dismissOnClick={true}>
                                        <Dropdown.Item onClick={() => setCategories('Sports')}>Sports</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setCategories('Martial Arts')}>Martial Arts</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setCategories('Fitness')}>Fitness</Dropdown.Item>
                                    </Dropdown>
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={handleSave}>Save and Publish</Button>
                            <Button color="gray" onClick={handleSave}>Save</Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
                        </Modal.Footer>
                    </Modal>

                    <Accordion alwaysOpen>
                        <Accordion.Panel>
                            <Accordion.Title>Published Blog Items</Accordion.Title>
                            <Accordion.Content>
                                <ListGroup className='w-484'>

                                    {
                                        // We are mapping through blogItems (an array of objects)
                                        // For every item in our array, we are checking if the entry is published
                                        // If the entry/blog item is published, we will render it out inside of our accordion
                                        // Adding the double ampersand to check that blogItems exists before mapping through the array
                                        blogItems && blogItems.map((item, idx) => {

                                            return (
                                                // We MUST have this idx
                                                // OR we could do items.id since each blog item has its own ID
                                                <div key={idx}>
                                                    {

                                                        item.isPublished && <div className='flex flex-col p-10'>
                                                            <h1 className='text-2xl '>{item.title}</h1>
                                                            <div className='flex flex-row space-x-3'>
                                                                <Button color='blue' onClick={() => handleEdit(item)}>Edit</Button>
                                                                <Button color='yellow' onClick={() => handlePublish(item)}>Unpublish</Button>
                                                                <Button color='red' onClick={() => handleDelete(item)}>Delete</Button>
                                                            </div>
                                                        </div>

                                                    }
                                                </div>
                                            )

                                        })
                                    }

                                </ListGroup>
                            </Accordion.Content>
                        </Accordion.Panel>

                        <Accordion.Panel>
                            <Accordion.Title>Unpublished Blog Items</Accordion.Title>
                            <Accordion.Content>
                                <ListGroup className='w-484'>

                                    {
                                        // We are mapping through blogItems (an array of objects)
                                        // For every item in our array, we are checking if the entry is published
                                        // If the entry/blog item is published, we will render it out inside of our accordion
                                        // Adding the double ampersand to check that blogItems exists before mapping through the array
                                        blogItems && blogItems.map((item, idx) => {

                                            return (
                                                // We MUST have this idx
                                                // OR we could do items.id since each blog item has its own ID
                                                <div key={idx}>
                                                    {
                                                        // We can use the ! in front of item.isPublished to say UNPUBLISHED
                                                        !item.isPublished && <div className='flex flex-col p-10'>
                                                            <h1 className='text-2xl '>{item.title}</h1>
                                                            <div className='flex flex-row space-x-3'>
                                                                <Button color='blue' onClick={() => handleEdit(item)}>Edit</Button>
                                                                <Button color='yellow' onClick={() =>handlePublish(item)}>Publish</Button>
                                                                <Button color='red' onClick={() => handleDelete(item)}>Delete</Button>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </ListGroup>
                            </Accordion.Content>
                        </Accordion.Panel>
                    </Accordion>
                </div>
            </div>
        </>
    )
}

export default Dashboard
