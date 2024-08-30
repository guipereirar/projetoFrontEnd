/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Projeto } from '@/types';
import { PerfilUsuarioService } from '@/service/PerfilUsuarioService';
import { UsuarioService } from '@/service/UsuarioService';
import { PerfilService } from '@/service/PerfilService';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

const PerfilUsuario = () => {
    let perfilUsuarioVazio: Projeto.PerfilUsuario = {
        id: 0,
        perfil: { descricao: '' },
        usuario: { nome: '', email: '', login: '', senha: '' }
    };

    const [perfisUsuario, setPerfisUsuario] = useState<Projeto.PerfilUsuario[] | null>(null);
    const [perfilUsuarioDialog, setPerfilUsuarioDialog] = useState(false);
    const [deletePerfilUsuarioDialog, setDeletePerfilUsuarioDialog] = useState(false);
    const [deletePerfisUsuarioDialog, setDeletePerfisUsuarioDialog] = useState(false);
    const [perfilUsuario, setPerfilUsuario] = useState<Projeto.PerfilUsuario>(perfilUsuarioVazio);
    const [selectedPerfisUsuario, setSelectedPerfisUsuario] = useState<Projeto.PerfilUsuario[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const perfilUsuarioService = useMemo(() => new PerfilUsuarioService(), []);
    const usuarioService = useMemo(() => new UsuarioService(), []);
    const perfilService = useMemo(() => new PerfilService(), []);
    const [usuarios, setUsuarios] = useState<Projeto.Usuario[]>([]);
    const [perfis, setPerfis] = useState<Projeto.Perfil[]>([]);

    useEffect(() => {
        if (!perfisUsuario) {
            perfilUsuarioService
                .listarTodos()
                .then((response) => {
                    console.log(response.data);
                    setPerfisUsuario(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [perfilUsuarioService, perfisUsuario]);

    useEffect(() => {
        if (perfilUsuarioDialog) {
            usuarioService
                .listarTodos()
                .then((response) => {
                    setUsuarios(response.data);
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Erro!',
                        detail: 'Erro ao carregar a lista de usuário'
                    });
                });
            perfilService
                .listarTodos()
                .then((response) => {
                    setPerfis(response.data);
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Erro!',
                        detail: 'Erro ao carregar lista de perfil'
                    });
                });
        }
    }, [perfilUsuarioDialog, perfilService, usuarioService]);

    const openNew = () => {
        setPerfilUsuario(perfilUsuarioVazio);
        setSubmitted(false);
        setPerfilUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPerfilUsuarioDialog(false);
    };

    const hideDeletePerfilUsuarioDialog = () => {
        setDeletePerfilUsuarioDialog(false);
    };

    const hideDeletePerfisUsuarioDialog = () => {
        setDeletePerfisUsuarioDialog(false);
    };

    const savePerfilUsuario = () => {
        setSubmitted(true);

        if (!perfilUsuario.id) {
            perfilUsuarioService
                .inserir(perfilUsuario)
                .then((response) => {
                    setPerfilUsuarioDialog(false);
                    setPerfilUsuario(perfilUsuarioVazio);
                    setPerfisUsuario(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Perfil do usuário cadastrado com sucesso!'
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Erro!',
                        detail: 'Erro ao salvar'
                    });
                });
        } else {
            perfilUsuarioService
                .alterar(perfilUsuario)
                .then((response) => {
                    setPerfilUsuarioDialog(false);
                    setPerfilUsuario(perfilUsuarioVazio);
                    setPerfisUsuario(null);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Perfil do usuário alterado com sucesso!'
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Erro!',
                        detail: 'Erro ao alterar'
                    });
                });
        }
    };

    const editPerfilUsuario = (perfilUsuario: Projeto.PerfilUsuario) => {
        setPerfilUsuario({ ...perfilUsuario });
        setPerfilUsuarioDialog(true);
    };

    const confirmDeletePerfilUsuario = (perfil: Projeto.PerfilUsuario) => {
        setPerfilUsuario(perfilUsuario);
        setDeletePerfilUsuarioDialog(true);
    };

    const deletePerfilUsuario = () => {
        if (perfilUsuario.id) {
            perfilUsuarioService
                .excluir(perfilUsuario.id)
                .then((response) => {
                    setPerfilUsuario(perfilUsuarioVazio);
                    setDeletePerfilUsuarioDialog(false);
                    setPerfisUsuario(null);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Successo!',
                        detail: 'Perfil do usuário deletado com sucesso!',
                        life: 3000
                    });
                })
                .catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao deletar perfil do usuário',
                        life: 3000
                    });
                });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePerfisUsuarioDialog(true);
    };

    const deleteSelectedPerfisUsuario = () => {
        Promise.all(
            selectedPerfisUsuario.map(async (_perfilUsuario) => {
                if (_perfilUsuario.id) {
                    await perfilUsuarioService
                        .excluir(_perfilUsuario.id)
                        .then((response) => {})
                        .catch((error) => {});
                }
            })
        )
            .then((response) => {
                setPerfisUsuario(null);
                setSelectedPerfisUsuario([]);
                setDeletePerfisUsuarioDialog(false);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successo!',
                    detail: 'Perfil do Usuario deletado com sucesso!',
                    life: 3000
                });
            })
            .catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao deletar perfis',
                    life: 3000
                });
            });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        // let _recurso = { ...recurso };
        // _recurso[`${name}`] = val;

        // setRecurso(_recurso);
        setPerfilUsuario((prevPerfilUsuario) => ({
            ...prevPerfilUsuario,
            [name]: val
        }));
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPerfisUsuario || !(selectedPerfisUsuario as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const perfilBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfil.descricao}
            </>
        );
    };

    const usuarioBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <span className="p-column-title">Usuário</span>
                {rowData.usuario.nome}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.PerfilUsuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editPerfilUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeletePerfilUsuario(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de perfis dos usuários</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const perfilUsuarioDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={savePerfilUsuario} />
        </>
    );
    const deletePerfilUsuarioDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePerfilUsuarioDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deletePerfilUsuario} />
        </>
    );
    const deletePerfisUsuarioDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePerfisUsuarioDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedPerfisUsuario} />
        </>
    );

    const onSelectPerfilChange = (perfil: Projeto.Perfil) => {
        let _perfilUsuario = { ...perfilUsuario };
        _perfilUsuario.perfil = perfil;
        setPerfilUsuario(_perfilUsuario);
    };

    const onSelectUsuarioChange = (usuario: Projeto.Usuario) => {
        let _perfilUsuario = { ...perfilUsuario };
        _perfilUsuario.usuario = usuario;
        setPerfilUsuario(_perfilUsuario);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={perfisUsuario}
                        selection={selectedPerfisUsuario}
                        onSelectionChange={(e) => setSelectedPerfisUsuario(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} perfis de usuário"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum perfil de usuário encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Código" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="perfil" header="Perfil" sortable body={perfilBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="usuario" header="Usuário" sortable body={usuarioBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={perfilUsuarioDialog} style={{ width: '450px' }} header="Detalhes de Perfis e Usuários" modal className="p-fluid" footer={perfilUsuarioDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                            <Dropdown optionLabel="descricao" value={perfilUsuario.perfil} options={perfis} filter onChange={(e: DropdownChangeEvent) => onSelectPerfilChange(e.value)} placeholder="Selecione um perfil" />
                            {submitted && !perfilUsuario.perfil && <small className="p-invalid">Perfil é obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="perfil">Usuário</label>
                            <Dropdown optionLabel="nome" value={perfilUsuario.usuario} options={usuarios} filter onChange={(e: DropdownChangeEvent) => onSelectUsuarioChange(e.value)} placeholder="Selecione um usuário" />
                            {submitted && !perfilUsuario.usuario && <small className="p-invalid">Usuário é obrigatório.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfilUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfilUsuarioDialogFooter} onHide={hideDeletePerfilUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilUsuario && (
                                <span>
                                    Tem certeza que quer desassociar o perfil <b>{perfilUsuario.perfil.descricao}</b> do usuário <b>{perfilUsuario.usuario.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePerfisUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deletePerfisUsuarioDialogFooter} onHide={hideDeletePerfisUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {perfilUsuario && <span>Tem certeza que quer desassociar os perfis dos usuários selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default PerfilUsuario;
