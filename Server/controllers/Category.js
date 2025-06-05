const Category = require("../models/Category");
const Course = require("../models/Course");

function getRandomInt(max) {
	return Math.floor(Math.random() *  max);
}

// Create category handler function
exports.createCategory = async (req, res) => {
  try {

    // fetch data
    const { name, description } = req.body

    // Validation
    if (!name || !description) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required",
      })
    }

    // Create entry in DB
    const CategorysDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategorysDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    })
  }
}

// Get all categories
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({}, {name:true, description:true});
    res.status(200).json({
      success: true,
      message:'All categories returned successfully',
      data:allCategories,
    })
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};


exports.categoryPageDetails = async (req, res) => {
	try {

		// get category id
		const { categoryId } = req.body;

		// Get courses for the specified category
		const selectedCategory = await Category.findById(categoryId)          
			.populate("course")
			.exec();
		console.log("SELECTED COURSE....",selectedCategory);

		// Handle the case when the category is not found
		if (!selectedCategory) {
			return res.status(404).json({ 
				success: false, 
				message: "Category not found",
			});
		}

		// Handle the case when there are no courses
		if (selectedCategory.course.length === 0) {
			console.log("No courses found for the selected category.");
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}

		// const selectedCourses = selectedCategory.course;

		// Get courses for other categories
		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId },
		});

		let differentCategory = await Category.findOne(
			categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
			  ._id
		  )
			.populate({
			  path: "course",
			  match: { status: "Published" },
			})
			.exec();
			console.log("CATEGORIES EXCEPTED SELECTED....", categoriesExceptSelected);
	  

		// let differentCourses = [];
		// for (const category of differentCategories ) {
		// 	differentCourses.push(...category.course);
		// }

		// Get top-selling courses across all categories
		const allCategories = await Category.find()
		.populate({
			path: "course",
			match: {status: "Published"},
			populate:{
				path: "instructor",
			}
		}).exec();
		console.log("AllCategories...",allCategories);
		
		const allCourses = allCategories.flatMap((category) => category.course);
		const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold)
			.slice(0, 10);

		res.status(200).json({
			success: true,
			data:{
				selectedCategory,
				differentCategory,
				mostSellingCourses,
			},
		});
	} 
	catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};


//add course to category
exports.addCourseToCategory = async (req, res) => {
	const { courseId, categoryId } = req.body;
	// console.log("category id", categoryId);
	try {
		const category = await Category.findById(categoryId);
		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}
		if(category.course.includes(courseId)){
			return res.status(200).json({
				success: true,
				message: "Course already exists in the category",
			});
		}
		category.course.push(courseId);
		await category.save();
		return res.status(200).json({
			success: true,
			message: "Course added to category successfully",
		});
	}
	catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};