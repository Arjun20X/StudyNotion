import React, { useEffect, useState } from 'react'
import Footer from '../components/Common/Footer'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { apiconnector } from '../Services/apiconnector';
import { categories } from '../Services/apis';
import { getCatalogPageData } from '../Services/operations/pageAndComponentData';
import CourseCard from "../components/core/Catalog/Course_Card"
import CourseSlider from "../components/core/Catalog/CourseSlider"
import Error from "./Error";

const Catalog = () => {

    const { loading } = useSelector((state) => state.profile)
    const {catalogName} = useParams();
    const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [categoryNotFound, setCategoryNotFound] = useState(false);

    // Fetch all categories and find matching one
    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await apiconnector("GET", categories.CATEGORIES_API);
                const matched = res?.data?.data?.filter(
                    (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
                )[0];
                if (matched) {
                    setCategoryId(matched._id);
                } else {
                    setCategoryNotFound(true);
                    setIsPageLoading(false);
                }
            } catch (err) {
                console.log(err);
                setCategoryNotFound(true);
                setIsPageLoading(false);
            }
        }
        setIsPageLoading(true);
        setCategoryNotFound(false);
        setCatalogPageData(null);
        setCategoryId(null);
        getCategories();
    }, [catalogName])

    useEffect(() => {
        const getCategoryDetails = async () => {
            try {
                const res = await getCatalogPageData(categoryId);
                setCatalogPageData(res || null);
            } catch(error) {
                console.log(error);
            } finally {
                setIsPageLoading(false);
            }
        }
        if (categoryId) {
            getCategoryDetails();
        }
    }, [categoryId]);

    if (loading || isPageLoading) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
    }

    if (categoryNotFound || !catalogPageData) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center text-richblack-5">
                <div className="text-center">
                    <p className="text-3xl font-semibold mb-3">No Courses Found</p>
                    <p className="text-richblack-300">There are no courses in this category yet.</p>
                </div>
            </div>
        )
    }

    if (!catalogPageData.success) {
        return <Error />
    }

  return (
    <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
            <p className="text-sm text-richblack-300">{`Home / Catalog / `}
                <span className="text-yellow-25">
                    {catalogPageData?.data?.selectedCategory?.name}
                </span>
            </p>
            <p className="text-3xl text-richblack-5">{catalogPageData?.data?.selectedCategory?.name}</p>
            <p className="max-w-[870px] text-richblack-200">{catalogPageData?.data?.selectedCategory?.description}</p>
        </div>

        <div>
            {/* Section-1 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Courses to get you started</div>
                <div className="my-4 flex border-b border-b-richblack-600 text-sm"  >
                    <p className={`px-4 py-2 ${active === 1
                        ? "border-b border-b-yellow-25 text-yellow-25"
                        : "text-richblack-50"
                        } cursor-pointer`}
                        onClick={() => setActive(1)}
                    >
                        Most Popular
                    </p>
                    <p
                    className={`px-4 py-2 ${active === 2
                        ? "border-b border-b-yellow-25 text-yellow-25"
                        : "text-richblack-50"
                        } cursor-pointer`}
                      onClick={() => setActive(2)}
                    >
                        New
                    </p>
                </div>
                <div>
                    <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} />
                </div>
            </div>

            {/* Section-2 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">
                    Top Courses in {catalogPageData?.data?.selectedCategory?.description}
                </div>
                <div className="py-8">
                    <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses} />
                </div>
            </div>

            {/* Section-3 */}
            <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                <div className="section_heading">Frequently Bought</div>
                <div className='py-8' >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {
                            catalogPageData?.data?.mostSellingCourses?.slice(0,4)
                            .map((course, index) => (
                                <CourseCard course={course} key={index} Height={"h-[400px]"} />
                            ))
                        }
                    </div>
                </div>
            </div>

        </div>

        <Footer/>

    </div>
  )
}

export default Catalog
