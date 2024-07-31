const getVacationImg = "http://localhost:3000/api/vacations/images/";

const fetchVacationImg = async (vacation) => {
    try {
        const response = await axios.get(getVacationImg + vacation?.imageName , { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(response.data);
        return imageUrl;
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
}

const fetchVacationImgWithName = async (imageName) => {
    try {
        const response = await axios.get(getVacationImg + imageName, { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(response.data);
        return imageUrl;
    } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
}

window.fetchVacationImg = fetchVacationImg;
window.fetchVacationImgWithName = fetchVacationImgWithName;
