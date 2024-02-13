import Head from "next/head";
import styles from "./styles.module.scss"
import { canSSRAuth } from "@/utils/canSSRAuth";
import { Header } from "@/components/Header";
import { FiUpload } from "react-icons/fi";
import { ChangeEvent, FormEvent, useState } from "react";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";

type ItemProps = {
    id: string;
    name: string;
}

interface CategoryProps{
    categoryList: ItemProps[];
}

export default function Product({categoryList}:CategoryProps){

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);
    //passando para o state as categorias ou se não tiver, um array vazio
    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelected, setCategorySelected] = useState(0)

    //Quando você seleciona uma nova categoria na lista
    function handleChangeCategory(event){
        setCategorySelected(event.target.value)
    }

    function handleFile(event: ChangeEvent<HTMLInputElement>){
        if(!event.target.files){
            return;
        }

        const image = event.target.files[0];

        if(!image){
            return;
        }

        if(image.type === 'image/jpeg' || image.type === "image/png"){
            setImageAvatar(image);
            //Criando o preview da imagem sem ter que cadastrar no banco
            setAvatarUrl(URL.createObjectURL(event.target.files[0]))
        }
    }

    async function handleRegister(event: FormEvent){
        event.preventDefault()
        try{
            //criando multipart/form-data
            const data = new FormData()

            if(name === '' || price === '' || description === '' || imageAvatar === null){
                toast.warning("Preencha todos os campos!")
                return;
            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[categorySelected].id);
            data.append('file', imageAvatar);

            const apiClient = setupAPIClient();
            await apiClient.post('/product', data)

            toast.success("Produto cadastrado com sucesso!")

        }catch(err){
            toast.error("Erro ao cadastrar produto!")
        }

        setName('')
        setPrice('')
        setDescription('')
        setImageAvatar(null)
        setAvatarUrl('')
    }
    return(
        <>
            <Head>
                <title>Novo produto - Sujeito Pizzaria</title>
            </Head>
            <div>
                <Header/>
                <main className={styles.container}>
                    <h1>Novo produto</h1>
                    <form className={styles.form} onSubmit={handleRegister}>

                        {/* Image Preview section */}
                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={30} color="#fff" />
                            </span>
                            <input type="file" accept="image/png, image/jpeg" onChange={handleFile}/>
                            
                            {avatarUrl && (
                                <img
                                className={styles.preview}
                                src={avatarUrl}
                                alt="Foto do produto"
                                width={250}
                                height={250}
                            />
                            )}
                        </label>

                        <select value={categorySelected} onChange={handleChangeCategory}>
                            {categories.map((item, index) => {
                                return(
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>

                        <input 
                            type="text"
                            placeholder="Digite o nome do produto"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input 
                            type="text" 
                            placeholder="Digite o preço do produto"
                            className={styles.input}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <textarea 
                            placeholder="Descreva seu produto"
                            className={styles.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <button className={styles.buttonAdd} type="submit">Cadastrar</button>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async(ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('category')

    return{
        props: {
            categoryList: response.data
        }
    }
})