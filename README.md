# Powerpoint Image Populate  
An add-in for generating images for powerpoint presentations. PPImagePopulate takes your slide title and content as an input then fetches photos based on keywords in your slide. Selected images populate directly to your slide.  
## Startup
PPImagePopulate relies on a service to convert urls into useable images for your slide. To run in Visual Studio, you must make sure this service starts up alongside the add-in. 
- Right-click on the solution and select properties (PPImagePopulate > properties).
![alt text](http://url/to/img.png)
- Select all projects for startup:
![alt text](http://url/to/img.png)
------------------------------------------------------------------------------------------------------------------------------------------
## Use  
Office Javascript API in its current implementation has many limititations, particularly with Powerpoint. Due to these limitations, there are some guidlines for use: 
  
- Office.js API does not allow one to read/write slide text by content type. For the sake of user friendliness I opted inputs that replicate your slide content. Reproduce the content of your slides plus or minus keywords that will aid in your image generation.
- In the body input, only bolded words will act as keywords.
- The typical bold hot-key(ctrl-b) is overloaded in Office add-ins to trigger an element inspector. Therefore, it is suggested you simply copy the contents of your slide to the inputs. This will allow bolded keywords in your body input. 
